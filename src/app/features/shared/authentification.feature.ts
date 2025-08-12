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

@Injectable()
export class AuthentificationFeature {

    constructor(
        private readonly otpRepo : OtpRepo,
        private readonly accountRepo : AccountRepo,
        private readonly resourceRepo : ResourceRepo,
        private readonly userRepo : UserRepo,
        private readonly tokenRepo : TokenRepo,
        private readonly authentificationService : AuthentificationService,
    ) {}

    async validateCode(context : ValidateCodeContext) : Promise<ApiResponse<OtpDtm>> {

        try {
            
            const action : OtpModel | null = await this.otpRepo.findAction(context.type, 'waiting', context.value, context.country_id);

            if(action == null)
            {
                return ApiResponseUtil.error('Action not initiated .', 'not_found');
            }

            const time_up = SharedUtil.isTimeUp(action.updated_at!, 3);

            if(time_up)
            {
                return ApiResponseUtil.error('Time elapsed, try again .', 'conflict');
            }

            if(action.code != context.code)
            {
                return ApiResponseUtil.error('Incorrect code entered .', 'conflict');
            }

            action.state = 'done';
            await this.otpRepo.save(action);

            return ApiResponseUtil.ok(OtpDtm.fromOtpDtm(action), 'Code validated 🎉 .');

        }catch(e){
            return ApiResponseUtil.error(e.message, 'internal_error');
        }

    }

    async initiated(context : InitiatedContext) : Promise<ApiResponse<UserOrCodeDtm>> {
        
        try{
            
            const country : CountryModel | null = await this.resourceRepo.findCountry(context.country_id);

            if(country == null)
            {
                return ApiResponseUtil.error('Country not found .', 'not_found');
            }

            const account = await this.accountRepo.fetchByLogin(context.login, context.country_id);

            if (account == null) 
            {
                const action = await this.otpRepo.findAction('verified_number', 'waiting', context.login, context.country_id);
                const code = SharedUtil.generateOtp(4) ;

                if(action == null)
                {
                    // send code to user ---------------

                    // ---------------------------------

                    const otp : OtpModel = { id :uuidv4(), type : 'verified_number', value : context.login, country_id : context.country_id, state : 'waiting', attempt : 1 ,  code}
                    await this.otpRepo.save(otp);

                    return ApiResponseUtil.ok(UserOrCodeDtm.fromCode(OtpDtm.fromOtpDtm(otp)), 'Code sent');
                }
                else
                {
                    const otp : OtpModel = await this.otpRepo.toValidate(action, code);
                    return ApiResponseUtil.ok(UserOrCodeDtm.fromCode(OtpDtm.fromOtpDtm(otp)), 'Code sent');
                }
            }
            else
            {
                if(account.locked)
                {
                    return ApiResponseUtil.error('Account locked, please try again .', 'conflict');
                }

                account.status = "processing";

                await this.accountRepo.save(account);

                return ApiResponseUtil.ok(UserOrCodeDtm.fromUser(UserDtm.fromUserDtm(account.user)), 'Good 🎉, enter your pin code .');
            }

        }catch(e){
            return ApiResponseUtil.error("An error occurred during your identification,  Please try again later .", 'internal_error');
        }

    }

    async signUp(context : SignUpContext) : Promise<ApiResponse<AccountDtm>> {
        try{
            const entity : EntityModel | null = await this.resourceRepo.findEntityByCode('Customer');
            const country : CountryModel | null = await this.resourceRepo.findCountry(context.country_id);

            if(entity == null)
            {
                return ApiResponseUtil.error('Entity not found .', 'not_found');
            }

            const action : OtpModel | null = await this.otpRepo.findAction('verified_number', 'done', context.login, context.country_id);

            if(action == null)
            {
                return ApiResponseUtil.error('Action not initiated .', 'not_found');
            }

            const time_up = SharedUtil.isTimeUp(action.updated_at!, 5);

            if(time_up)
            {
                return ApiResponseUtil.error('Time elapsed, try again .', 'conflict');
            }

            const user : UserModel = { id : uuidv4(), civility : context.civility, name : context.name, surname : context.surname, number : context.login };
            const userSaved = await this.userRepo.save(user);


            const password = await this.authentificationService.hashPassword(context.password);
            

            const account : AccountModel = { id : uuidv4(), login : context.login, password : password, user : userSaved, country : country!, entity : entity, status : 'connected'};

            const token = await this.authentificationService.generateToken(AccountDtm.fromAccountDtm(account));
            const model : TokenModel = { id : uuidv4(), token : token, type : 'to_connect', account_id : account.id, expired_at : SharedUtil.addDaysToNow(1)};
                
            ;
            const saved = await this.accountRepo.save(account);
            await this.tokenRepo.save(model)
            await this.otpRepo.remove(action);

            return ApiResponseUtil.ok({...AccountDtm.fromAccountDtm(saved), token : token}, 'Account created 🎉 .');

        }catch(e){
            return ApiResponseUtil.error(e.message, 'internal_error');
        }
    }

    async signIn(context : SignInContext) : Promise<ApiResponse<AccountDtm>> {

        const account = await this.accountRepo.fetchByLogin(context.login, context.country_id);

        if (account == null) 
        {
            return ApiResponseUtil.error('Account not found .', 'not_found');
        }

        if(account.locked)
        {
            return ApiResponseUtil.error('Account locked, please try again .', 'conflict');
        }

        const password = await this.authentificationService.comparePassword(context.password, account.password);

        if(!password)
        {
            return ApiResponseUtil.error('Incorrect password .', 'conflict');
        }

        const token = await this.authentificationService.generateToken(AccountDtm.fromAccountDtm(account));
        const model : TokenModel = { id : uuidv4(), token : token, type : 'to_connect', account_id : account.id, expired_at : SharedUtil.addDaysToNow(1)};
        await this.tokenRepo.save(model);

        account.status = "connected";
        const saved = await this.accountRepo.save(account);

        return ApiResponseUtil.ok({...AccountDtm.fromAccountDtm(saved), token : token}, 'Good 🎉, welcome back .');
    }

    async signOut(dtm : AccountDtm ) : Promise<ApiResponse<AccountDtm>> {

        const account = await this.accountRepo.fetchByLogin(dtm.login, dtm.country.id);

        if(account == null)
        {
            return ApiResponseUtil.error('Account not found .', 'not_found');
        }

        if(account.status != 'connected')
        {
            return ApiResponseUtil.error('Account not connected .', 'unauthorized');
        }

        account.status = "unconnected";
        const saved = await this.accountRepo.save(account);
        await this.tokenRepo.remove(dtm.id);

        return ApiResponseUtil.ok(AccountDtm.fromAccountDtm(saved), 'Good 🎉, you are now disconnected .');
    }

}