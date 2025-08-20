import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { UserRepo } from "src/app/repo/user_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from "@nestjs/common";
import { AccountRepo } from "src/app/repo/account_repo";
import { CreateCustomerContext } from "src/app/context/customer.context";
import { ResourceRepo } from "src/app/repo/resource_repo";
import { CountryModel } from "src/core/domain/models/country.model";
import { AccountModel } from "src/core/domain/models/account.model";
import { UserModel } from "src/core/domain/models/user.model";
import { AuthentificationService } from "src/core/services/authenfication.service";
import { EntityModel } from "src/core/domain/models/entity.model";

@Injectable()
export class CustomerFeature {

    constructor(
        private readonly accountRepo : AccountRepo,
        private readonly userRepo : UserRepo,
        private readonly resourceRepo : ResourceRepo,
        private readonly authentificationService : AuthentificationService,
    ) {}

    async listing() : Promise<ApiResponse<AccountDtm[]>> {
        const customers = await this.accountRepo.findAllCustomer();
        const account = customers.map(account => AccountDtm.fromAccountDtm(account));
        return ApiResponseUtil.ok(account,'', 'Customers listed 🎉 .');
    }

    async createCustomer(context : CreateCustomerContext) : Promise<ApiResponse<AccountDtm>> {


        try {

            const country : CountryModel | null = await this.resourceRepo.findCountry(context.country_id);

            if(country == null)
            {
                return ApiResponseUtil.error('','Country not found .', 'not_found');
            }

            const account : AccountModel | null = await this.accountRepo.fetchByLogin(context.number, context.country_id);

            if (account == null)
            {
                const find_email : UserModel | null = await this.userRepo.findByEmail(context.email);

                if(find_email == null)
                {
                    const find_number : UserModel | null = await this.userRepo.findByNumber(context.number);

                    if(find_number != null)
                    {
                        return ApiResponseUtil.error('','This number is already used .', 'conflict');
                    }

                    const user : UserModel = { id : uuidv4(), civility : context.civility, name : context.name, surname : context.surname, number : context.number , email : context.email };
                    await this.userRepo.save(user);

                    const password = await this.authentificationService.hashPassword("12563");

                    const entity : EntityModel | null = await this.resourceRepo.findEntityByCode("Customer") as EntityModel;

                    const account : AccountModel = { id : uuidv4(), login : context.number, password : password, user : user, country : country!, entity : entity , fcm_token : `${context.number}@fcm`};

                    const saved = await this.accountRepo.save(account);

                    return ApiResponseUtil.ok({...AccountDtm.fromAccountDtm(saved)},'', 'Customer created 🎉 .');

                }
                else
                {
                    return ApiResponseUtil.error('','This email is already used .', 'conflict');
                }
            }
            else
            {
                return ApiResponseUtil.error('','Account already exists .', 'conflict');
            }

        }catch(e){
            return ApiResponseUtil.error('',"Failed to create customer .", "internal_error");
        }

    }

}