import { Injectable } from "@nestjs/common";
import { UpdateBusinessCardContext, UpdateCustomerContext, UpdatePasswordContext } from "src/app/context/setting.context";
import { AccountRepo } from "src/app/repo/account_repo";
import { BusinessCardRepo } from "src/app/repo/business_card_repo";
import { UserRepo } from "src/app/repo/user_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { BusinessCardDtm } from "src/core/domain/dtms/business_card.dtm";
import { AccountModel } from "src/core/domain/models/account.model";
import { BusinessCardModel } from "src/core/domain/models/business_card.model";
import { UserModel } from "src/core/domain/models/user.model";
import { AuthentificationService } from "src/core/services/authenfication.service";
import { R2Service } from "src/core/services/r2.service";
import * as fs from 'fs';
import { FirebaseService } from "src/core/services/firebase.service";

@Injectable()
export class SettingFeature {

    constructor(
            private readonly accountRepo : AccountRepo,
            private readonly userRepo : UserRepo,
            private readonly businessCardRepo : BusinessCardRepo,
            private readonly authentificationService : AuthentificationService,
            private readonly r2Service: R2Service,
            private readonly firebaseService : FirebaseService,
        ) {}

    async updatePassword(accountDtm : AccountDtm, updatePasswordContext : UpdatePasswordContext) : Promise<ApiResponse<String>> {
        try {

            const account : AccountModel | null = await this.accountRepo.findById(accountDtm.id)

            if(account == null)
            {
                return ApiResponseUtil.error('Session inactive','Désolé, votre session a expiré, merci de bien vouloir vous reconnecter et réessayer .', 'unauthorized')
            }

            const isLastPassword : boolean = await this.authentificationService.comparePassword(updatePasswordContext.last_password, account.password);

            if(isLastPassword)
            {
                account.password = await this.authentificationService.hashPassword(updatePasswordContext.password);
                await this.accountRepo.save(account);

                return ApiResponseUtil.ok('Password updated 🎉 .','Mot de passe modifié', 'Votre mot de passe a belle et bien été mis à jour .');
            }
            else{
                return ApiResponseUtil.error('Ancien de mot passe erroné','Désolé, l\'ancien mot de passe fourni n\'est pas correct, merci de bien vouloir réessayer avec le bon .', 'conflict')
            }

        }catch(e){
            return ApiResponseUtil.error('Erreur interne','Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }

    async updateCustomerInfo(accountDtm : AccountDtm, updateCustomerContext : UpdateCustomerContext, file: Express.Multer.File) : Promise<ApiResponse<AccountDtm>> {
        try {

            const user : UserModel | null = await this.userRepo.findById(accountDtm.user.id)

            if(user == null)
            {
                return ApiResponseUtil.error('Session inactive','Désolé, votre session a expiré, merci de bien vouloir vous reconnecter et réessayer .', 'unauthorized')
            }

            const buffer = fs.readFileSync(file.path);
            const folder = "maaleek/avatars";

            await this.r2Service.uploadFile(
                file.filename,
                buffer,
                file.mimetype,
                folder
            );

            if (user.picture &&  user.picture.trim() !== "" &&  user.picture !== `${folder}/${file.filename}`) {
                await this.r2Service.deleteFile(user.picture);
            }

            user.picture = `${folder}/${file.filename}`;
            user.civility = updateCustomerContext.civility
            user.name = updateCustomerContext.name
            user.surname = updateCustomerContext.surname

            await this.userRepo.save(user)

            const account = await this.accountRepo.findById(accountDtm.id) as AccountModel;

            await this.firebaseService.update('business_card_trackings', account.document_id!, {
                setup : {profil : true}
            })

            return ApiResponseUtil.ok(AccountDtm.fromAccountDtm(account),'Profil mis à jour', 'Vos informations de profil ont belle et bien été mis à jour . .')

        }catch(e){
            console.log(e)
            return ApiResponseUtil.error('Erreur interne','Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }

    async updateBusinessCardInfo(accountDtm : AccountDtm, context : UpdateBusinessCardContext) : Promise<ApiResponse<BusinessCardDtm>> {
        try {

                const user : UserModel | null = await this.userRepo.findById(accountDtm.user.id)

                if(user == null)
                {
                    return ApiResponseUtil.error('Session inactive','Désolé, votre session a expiré, merci de bien vouloir vous reconnecter et réessayer .', 'unauthorized')
                }

                const businessCard : BusinessCardModel | null = await this.businessCardRepo.findByEmailOrNumber(context.email, context.number)

                if(businessCard != null && businessCard.user.id != user.id)
                {
                    return ApiResponseUtil.error('Coordonnées existant','Désolé, les coordonnées sont déjà utilisées par une tiers personne, merci de bien vouloir réessayer .', 'conflict')
                }

                const userBusinessCard : BusinessCardModel | null = await this.businessCardRepo.findByUserId(user.id)

                if(userBusinessCard == null)
                {
                    return ApiResponseUtil.error('Carte inexistant','Désolé, vous n\'avez pas de carte de visite, merci de bien vouloir réessayer .', 'not_found')
                }

                userBusinessCard.email = context.email
                userBusinessCard.number = context.number
                userBusinessCard.job = context.job

                userBusinessCard.social_networks[0] = context.linkedin_link 
                userBusinessCard.social_networks[1] = context.portfolio_link 
                userBusinessCard.social_networks[2] = context.facebook_link 
                
                await this.businessCardRepo.save(userBusinessCard)

                return ApiResponseUtil.ok(BusinessCardDtm.fromBusinessCardDtm(userBusinessCard),'Carte configurée','Vos informations relatives à la carte de visite ont été mises à jour 🎉 .');


        }catch(e){
            console.log(e)
            return ApiResponseUtil.error('Erreur interne','Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }

    async userBusinessCard(accountDtm : AccountDtm) : Promise<ApiResponse<BusinessCardDtm>> {
        try {

            const user : UserModel | null = await this.userRepo.findById(accountDtm.user.id)

            if(user == null)
            {
                return ApiResponseUtil.error('Session inactive','Désolé, votre session a expiré, merci de bien vouloir vous reconnecter et réessayer .', 'unauthorized')
            }

            const businessCard : BusinessCardModel | null = await this.businessCardRepo.findByUserId(user.id)

            if(businessCard == null)
            {
                return ApiResponseUtil.error('Carte inexistant','Désolé, vous n\'avez pas de carte de visite, merci de bien vouloir réessayer .', 'not_found')
            }

            return ApiResponseUtil.ok(BusinessCardDtm.fromBusinessCardDtm(businessCard),'','Votre carte de visite 🎉 .');

        }catch(e){
            return ApiResponseUtil.error('Erreur interne','Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }

}