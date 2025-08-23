import { Injectable } from "@nestjs/common";
import { InitiatedContext, SignInContext, SignUpContext, ValidateCodeContext } from "src/app/context/authentification.context";
import { OtpRepo } from "src/app/repo/otp_repo";
import { AccountRepo } from "src/app/repo/account_repo";
import { SharedUtil } from "src/app/utils/shared.util";
import { OtpModel } from "src/core/domain/models/otp.model";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { UserOrCodeDtm } from "src/core/domain/dtms/user_or_code.dtm";
import { OtpDtm } from "src/core/domain/dtms/otp.dtm";
import { UserDtm } from "src/core/domain/dtms/user.dtm";
import { ResourceRepo } from "src/app/repo/resource_repo";
import { CountryModel } from "src/core/domain/models/country.model";
import { AccountModel } from "src/core/domain/models/account.model";
import { EntityModel } from "src/core/domain/models/entity.model";
import { UserModel } from "src/core/domain/models/user.model";
import { UserRepo } from "src/app/repo/user_repo";
import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { AuthentificationService } from "src/core/services/authenfication.service";
import { TokenRepo } from "src/app/repo/token_repo";
import { TokenModel } from "src/core/domain/models/token.model";
import { v4 as uuidv4 } from 'uuid';
import { FirebaseService } from "src/core/services/firebase.service";
import { NotificationRepo } from "src/app/repo/notification_repo";
import { NotificationType } from "@prisma/client";

@Injectable()
export class AuthentificationFeature {

    constructor(
        private readonly otpRepo : OtpRepo,
        private readonly accountRepo : AccountRepo,
        private readonly resourceRepo : ResourceRepo,
        private readonly userRepo : UserRepo,
        private readonly tokenRepo : TokenRepo,
        private readonly notificationRepo : NotificationRepo,
        private readonly authentificationService : AuthentificationService,
        private readonly firebaseService : FirebaseService,
    ) {}

    async validateCode(context : ValidateCodeContext) : Promise<ApiResponse<OtpDtm>> {

        try {
            
            const action : OtpModel | null = await this.otpRepo.findAction(context.type, 'waiting', context.value, context.country_id);

            if(action == null)
            {
                return ApiResponseUtil.error('Aucune action trouvé','Vous n\'avez aucune validation en attente pour le moment, merci de reprendre la procédure .', 'not_found');
            }

            const time_up = SharedUtil.isTimeUp(action.updated_at!, 3);

            if(time_up)
            {
                return ApiResponseUtil.error('Temps écoulé','Le temps de validation est écoulé, merci de réessayer avec un nouveau code .', 'conflict');
            }

            if(action.code != context.code)
            {
                return ApiResponseUtil.error('Code Incorrect','Le code de validation soumis est incorrect, merci de réessayer avec un code valide .', 'conflict');
            }

            action.state = 'done';
            await this.otpRepo.save(action);

            return ApiResponseUtil.ok(OtpDtm.fromOtpDtm(action), 'Code validé', 'Votre code à été validé avec succès, merci de poursuivre votre procédure 🎉 .');

        }catch(e){
            return ApiResponseUtil.error('Erreur interne','Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }

    }

    async initiated(context : InitiatedContext) : Promise<ApiResponse<UserOrCodeDtm>> {
        
        try{
            
            const country : CountryModel | null = await this.resourceRepo.findCountry(context.country_id);

            if(country == null)
            {
                return ApiResponseUtil.error('Pays inexistant','Désole, le pays selectionné semble ne pas exister, merci de bien vouloir réessayer avec un autre pays .', 'not_found');
            }

            const account = await this.accountRepo.fetchByLogin(context.login, context.country_id);

            if (account == null) 
            {
                const action = await this.otpRepo.findAction('verified_number', 'waiting', context.login, context.country_id);
                const code = "1234" // SharedUtil.generateOtp(4) ;

                if(action == null)
                {
                    // send code to user ---------------

                    // ---------------------------------

                    const otp : OtpModel = { id :uuidv4(), type : 'verified_number', value : context.login, country_id : context.country_id, state : 'waiting', attempt : 1 ,  code}
                    await this.otpRepo.save(otp);

                    return ApiResponseUtil.ok(UserOrCodeDtm.fromCode(OtpDtm.fromOtpDtm(otp)), 'Code envoyé', 'Un code vous a été envoyé .');
                }
                else
                {
                    const otp : OtpModel = await this.otpRepo.toValidate(action, code);
                    return ApiResponseUtil.ok(UserOrCodeDtm.fromCode(OtpDtm.fromOtpDtm(otp)),'Code envoyé', 'Un code vous a été envoyé .');
                }
            }
            else
            {
                if(account.locked)
                {
                    return ApiResponseUtil.error('Compte bloqué', 'Votre compte est bloqué, merci de bien vouloir contacter notre service pour une vérification de votre identité .', 'conflict');
                }

                account.status = "processing";

                await this.accountRepo.save(account);

                return ApiResponseUtil.ok(UserOrCodeDtm.fromUser(UserDtm.fromUserDtm(account.user)), 'Mot de passe requis', 'Bien 🎉, entez votre mon de passe .');
            }

        }catch(e){
            console.log(e);
            return ApiResponseUtil.error('Erreur interne','Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }

    }

    async signUp(context : SignUpContext) : Promise<ApiResponse<AccountDtm>> {
        try{
            const entity : EntityModel | null = await this.resourceRepo.findEntityByCode('Customer');
            const country : CountryModel | null = await this.resourceRepo.findCountry(context.country_id);

            if(entity == null)
            {
                return ApiResponseUtil.error('Erreur interne','Une donnée indispensable à votre inscription est introuvable, merci de contactez l\'assistance si cela persiste .', 'not_found');
            }

            const action : OtpModel | null = await this.otpRepo.findAction('verified_number', 'done', context.login, context.country_id);

            if(action == null)
            {
                return ApiResponseUtil.error('Aucune action trouvé','Vous n\'avez aucune validation en attente pour le moment, merci de reprendre la procédure .', 'not_found');
            }

            const time_up = SharedUtil.isTimeUp(action.updated_at!, 5);

            if(time_up)
            {
                return ApiResponseUtil.error('Temps écoulé','Le temps d\'inscription est écoulé, merci de réessayer avec un nouveau code .', 'conflict');
            }

            const user : UserModel = { id : uuidv4(), civility : context.civility, name : context.name.trim(), surname : context.surname.trim(), number : context.login.trim() };
            const userSaved = await this.userRepo.save(user);


            const password = await this.authentificationService.hashPassword(context.password.trim());
            

            const account : AccountModel = { id : uuidv4(), login : context.login, password : password, user : userSaved, country : country!, entity : entity, status : 'connected' , fcm_token : context.fcm_token};

            const token = await this.authentificationService.generateToken(AccountDtm.fromAccountDtm(account));
            const model : TokenModel = { id : uuidv4(), token : token, type : 'to_connect', account_id : account.id, expired_at : SharedUtil.addDaysToNow(1)};
                
            ;
            const saved = await this.accountRepo.save(account);
            await this.tokenRepo.save(model)
            await this.otpRepo.remove(action);

            setTimeout(async () => {
            await this.firebaseService.toPush(
                account.fcm_token!,
                "C’est parti 🚀",
                "Super nouvelle 🎉 Vous avez déjà 10 cartes de visite prêtes à partager avec vos contacts .",
            );
            }, 5000);

            await this.firebaseService.toSave('business_card_trackings',{
                account : account.id,
                business_card : account.user.businessCard?.offer.sharing_number,
                business_card_received : 0
            })

            await this.notificationRepo.save({
                id : uuidv4(),
                account : account,
                type : NotificationType.WELCOME,
                title : "Merci d'avoir rejoint maaleek 🎉",
                message : "Nous sommes ravis de vous compter parmi nous. Ensemble, construisons un réseau solide et inspirant !",
            });


            return ApiResponseUtil.ok({...AccountDtm.fromAccountDtm(saved), token : token , expired_at : model.expired_at}, 'Compte créer', 'Bienvenue 🎉, votre compte a été créé avec succès, accéder à votre espace .');

        }catch(e){
            console.log(e)
            return ApiResponseUtil.error('Erreur interne','Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }

    async signIn(context : SignInContext) : Promise<ApiResponse<AccountDtm>> {

        const account = await this.accountRepo.fetchByLogin(context.login, context.country_id);

        if (account == null) 
        {
            return ApiResponseUtil.error('Compte inexistant','Votre compte n\'existe pas, merci de bien vouloir contacter notre service pour une vérification de votre identité .', 'conflict');
        }

        if(account.locked)
        {
            return ApiResponseUtil.error('Compte bloqué', 'Votre compte est bloqué, merci de bien vouloir contacter notre service pour une vérification de votre identité .', 'conflict');
        }

        const password = await this.authentificationService.comparePassword(context.password, account.password);

        if(!password)
        {
            return ApiResponseUtil.error('Accès réfusé','Le mot de passe fourni est incorrect, merci de réessayer avec le bon mot de passe .', 'conflict');
        }

        const token = await this.authentificationService.generateToken(AccountDtm.fromAccountDtm(account));
        const model : TokenModel = { id : uuidv4(), token : token, type : 'to_connect', account_id : account.id, expired_at : SharedUtil.addDaysToNow(1)};
        await this.tokenRepo.save(model);

        account.status = "connected";
        const saved = await this.accountRepo.save(account);

        return ApiResponseUtil.ok({...AccountDtm.fromAccountDtm(saved), token : token , expired_at : model.expired_at}, 'Session active', 'Bien 🎉, bon retour parmis nous, votre espace n\'attendais que vous.');
    }

    async signOut(dtm : AccountDtm ) : Promise<ApiResponse<AccountDtm>> {

        const account = await this.accountRepo.fetchByLogin(dtm.login, dtm.country.id);

        if(account == null)
        {
            return ApiResponseUtil.error('Compte introuvable', 'Votre compte semble ne pas existé réessayer, et si le problème persiste, merci de bien vouloir contacter notre service pour assistance .', 'not_found');
        }

        if(account.status != 'connected')
        {
            return ApiResponseUtil.error('Session inactive', 'Vous n\'avez pas de session active jusqu\'a présent, nous ne pouvons donnez suite à votre requête .', 'unauthorized');
        }

        account.status = "unconnected";
        const saved = await this.accountRepo.save(account);
        await this.tokenRepo.remove(dtm.id);

        return ApiResponseUtil.ok(AccountDtm.fromAccountDtm(saved), 'Session désactivée', 'Bye 👋, vous avez été deconnecté avec succès, au plaisir de vous revoir très bien sur maaleek .');
    }

}