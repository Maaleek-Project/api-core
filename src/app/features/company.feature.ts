import { Injectable } from "@nestjs/common";
import { CompanyRepo } from "../repo/company_repo";
import { ApiResponse, ApiResponseUtil } from "../utils/api-response.util";
import { CompanyDtm } from "src/core/domain/dtms/company.dtm";
import { ResourceRepo } from "../repo/resource_repo";
import { CreateCompanyContext } from "../context/company.context";
import { AccountRepo } from "../repo/account_repo";
import { CompanyModel } from "src/core/domain/models/company.model";
import { AccountModel } from "src/core/domain/models/account.model";
import { UserRepo } from "../repo/user_repo";
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from "src/core/domain/models/user.model";
import { AuthentificationService } from "src/core/services/authenfication.service";
import { EntityModel } from "src/core/domain/models/entity.model";

@Injectable()
export class CompanyFeature {

    constructor(
        private readonly companyRepo : CompanyRepo,
        private readonly resourceRepo : ResourceRepo,
        private readonly accountRepo : AccountRepo,
        private readonly userRepo : UserRepo,
        private readonly authentificationService : AuthentificationService,
    ) {}

    async listing() : Promise<ApiResponse<CompanyDtm[]>> {
        const companies = await this.companyRepo.findAllCompanies();
        const dtos = companies.map(company => CompanyDtm.fromCompanyDtm(company));
        return ApiResponseUtil.ok(dtos, 'Companies listed 🎉 .');
    }


    async createCompany(context : CreateCompanyContext) : Promise<ApiResponse<CompanyDtm>> {
        try{

            const country = await this.resourceRepo.findCountry(context.country_id);

            if(country == null)
            {
                return ApiResponseUtil.error('Country not found .', 'not_found');
            }

            const find_email_or_number : CompanyModel | null = await this.companyRepo.findByNumerOrEmail(context.company_number, context.company_email);
            
            if(find_email_or_number != null)
            {
                return ApiResponseUtil.error('Company email or number is already used .', 'conflict');
            }

            const account : AccountModel | null = await this.accountRepo.fetchByLogin(context.manager_number, context.country_id);

            if (account == null)
            {
                const user : UserModel | null = await this.userRepo.findByEmail(context.manager_email);

                if(user == null)
                {
                    const find_number : UserModel | null = await this.userRepo.findByNumber(context.manager_number);

                    if(find_number != null)
                    {
                        return ApiResponseUtil.error('This number is already used .', 'conflict');
                    }

                    const user : UserModel = { id : uuidv4(), civility : context.manager_civility, name : context.manager_email, surname : context.manager_surname, number : context.manager_number , email : context.manager_email };
                    await this.userRepo.save(user);

                    const password = await this.authentificationService.hashPassword("12563");

                    const entity : EntityModel | null = await this.resourceRepo.findEntityByCode("Company") as EntityModel;

                    const account : AccountModel = { id : uuidv4(), login : context.manager_email, password : password, user : user, country : country!, entity : entity};

                    const saved = await this.accountRepo.save(account);

                    const company : CompanyModel = { id : uuidv4(), name : context.company_name, number : context.company_number, email : context.company_email, account : saved, address : context.company_address};

                    const saved_company = await this.companyRepo.save(company);

                    return ApiResponseUtil.ok({...CompanyDtm.fromCompanyDtm(saved_company)}, 'Company created 🎉 .');
                    
                }
                else
                {
                    return ApiResponseUtil.error('Manager email is already used .', 'conflict');
                }
            }
            else
            {
                return ApiResponseUtil.error('Manager number is already used .', 'conflict');
            }


        }catch(e){
            console.log(e)
            return ApiResponseUtil.error("Failed to create company .", "internal_error");
        }
    }
    
}