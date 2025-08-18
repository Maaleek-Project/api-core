import { Injectable } from "@nestjs/common";
import { UpdateCustomerContext, UpdatePasswordContext } from "src/app/context/setting.context";
import { AccountRepo } from "src/app/repo/account_repo";
import { UserRepo } from "src/app/repo/user_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { UserDtm } from "src/core/domain/dtms/user.dtm";
import { AccountModel } from "src/core/domain/models/account.model";
import { UserModel } from "src/core/domain/models/user.model";
import { AuthentificationService } from "src/core/services/authenfication.service";

@Injectable()
export class SettingFeature {

    constructor(
            private readonly accountRepo : AccountRepo,
            private readonly userRepo : UserRepo,
            private readonly authentificationService : AuthentificationService,
        ) {}

    async updatePassword(accountDtm : AccountDtm, updatePasswordContext : UpdatePasswordContext) : Promise<ApiResponse<String>> {
        try {

            const account : AccountModel | null = await this.accountRepo.findById(accountDtm.id)

            if(account == null)
            {
                return ApiResponseUtil.error('Account not found, please connected .', 'unauthorized')
            }

            const isLastPassword : boolean = await this.authentificationService.comparePassword(updatePasswordContext.last_password, account.password);

            if(isLastPassword)
            {
                account.password = await this.authentificationService.hashPassword(updatePasswordContext.password);
                await this.accountRepo.save(account);

                return ApiResponseUtil.ok('Password updated 🎉 .', 'Password updated 🎉 .');
            }
            else{
                return ApiResponseUtil.error('Last password is not valid .', 'conflict')
            }

        }catch(e){
            return ApiResponseUtil.error("Failed to update password ." , "internal_error")
        }
    }

    async updateCustomerInfo(accountDtm : AccountDtm, updateCustomerContext : UpdateCustomerContext) : Promise<ApiResponse<UserDtm>> {
        try {

            const user : UserModel | null = await this.userRepo.findById(accountDtm.user.id)

            if(user == null)
            {
                return ApiResponseUtil.error('Account not found, please connected .', 'unauthorized')
            }

            user.civility = updateCustomerContext.civility
            user.name = updateCustomerContext.name
            user.surname = updateCustomerContext.surname

            await this.userRepo.save(user)

            return ApiResponseUtil.ok(UserDtm.fromUserDtm(user), 'User updated 🎉 .')

        }catch(e){
            return ApiResponseUtil.error("Failed to update info ." , "internal_error")
        }
    }

}