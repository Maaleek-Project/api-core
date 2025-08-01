import { Injectable } from "@nestjs/common";
import { CreateWorkerContext } from "src/app/context/worker.context";
import { AccountRepo } from "src/app/repo/account_repo";
import { CompanyRepo } from "src/app/repo/company_repo";
import { ResourceRepo } from "src/app/repo/resource_repo";
import { UserRepo } from "src/app/repo/user_repo";
import { WorkerRepo } from "src/app/repo/worker_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { WorkerDtm } from "src/core/domain/dtms/worker.dtm";
import { AccountModel } from "src/core/domain/models/account.model";
import { CompanyModel } from "src/core/domain/models/company.model";
import { CountryModel } from "src/core/domain/models/country.model";
import { EntityModel } from "src/core/domain/models/entity.model";
import { UserModel } from "src/core/domain/models/user.model";
import { WorkerModel } from "src/core/domain/models/worker.model";
import { AuthentificationService } from "src/core/services/authenfication.service";
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class WorkerFeature {



    constructor(
        private readonly accountRepo : AccountRepo,
        private readonly workerRepo : WorkerRepo,
        private readonly companyRepo : CompanyRepo,
        private readonly resourceRepo : ResourceRepo,
        private readonly userRepo : UserRepo,
        private readonly authentificationService : AuthentificationService,
    ) {}


    async addWorker(context : CreateWorkerContext, accountDtm : AccountDtm) : Promise<ApiResponse<WorkerDtm>> {

        try{

            var worker : WorkerModel | null = null;

            // ---- PRE-CHECKS ---------------------------

            const country : CountryModel | null = await this.resourceRepo.findCountry(context.country_id);

            const account = await this.accountRepo.fetchByLogin(context.number, context.country_id);

            const company : CompanyModel | null = await this.companyRepo.findByAccount(accountDtm.id);

            // --------------------------------------------

            if(country == null)
            {
                return ApiResponseUtil.error('Country not found .', 'not_found');
            }

            if(company == null)
            {
                return ApiResponseUtil.error('Company not found .', 'not_found');
            }

            if(context.type == 'already_exist' )
            {

                if (account == null)
                {
                    return ApiResponseUtil.error('Account not found .', 'not_found');
                }

                const find_worker : WorkerModel | null = await this.workerRepo.findWorker(account.id);


                if(find_worker != null)
                {
                    return ApiResponseUtil.error('This worker is already registered .', 'conflict');
                }

                const to_saved : WorkerModel = { id : uuidv4(), account : account, company : company};
                worker = await this.workerRepo.save(to_saved);
            }
            else
            {
                if(account != null)
                {
                    return ApiResponseUtil.error('Account already exists .', 'conflict');
                }

                const find_user : UserModel | null = await this.userRepo.findByEmailOrNumber(context.email, context.number);

                if(find_user != null)
                {
                    return ApiResponseUtil.error('Number or email already used .', 'conflict');
                }

                const password = await this.authentificationService.hashPassword("12563");

                const entity : EntityModel | null = await this.resourceRepo.findEntityByCode("Customer") as EntityModel;

                const user : UserModel = { id : uuidv4(), civility : context.civility, name : context.name, surname : context.surname, number : context.number , email : context.email };
                await this.userRepo.save(user);

                const user_account : AccountModel = { id : uuidv4(), login : context.email, password : password, user : user, country : country!, entity : entity};
                const saved = await this.accountRepo.save(user_account);

                const to_saved : WorkerModel = { id : uuidv4(), account : saved, company : company};
                worker = await this.workerRepo.save(to_saved);
            }

            return ApiResponseUtil.ok({...WorkerDtm.fromWorkerDtm(worker)}, 'Worker created 🎉 .');

        }catch(e){
            console.log(e)
            return ApiResponseUtil.error("Failed to create worker .", "internal_error");
        }

    }

    async listingWorkers(accountDtm : AccountDtm) : Promise<ApiResponse<WorkerDtm[]>> {
        const company : CompanyModel | null = await this.companyRepo.findByAccount(accountDtm.id);

        if(company == null)
        {
            return ApiResponseUtil.error('Company not found .', 'not_found');
        }

        const workers = await this.workerRepo.findByCompany(company.id);
        const dtms = workers.map(worker => WorkerDtm.fromWorkerDtm(worker));
        return ApiResponseUtil.ok(dtms, 'Workers listed 🎉 .');
    }

}