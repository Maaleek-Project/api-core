import { Injectable } from "@nestjs/common";
import { CreateWorkerContext, SearchWorkerContext } from "src/app/context/worker.context";
import { AccountRepo } from "src/app/repo/account_repo";
import { CompanyRepo } from "src/app/repo/company_repo";
import { ResourceRepo } from "src/app/repo/resource_repo";
import { BusinessCardRepo } from "src/app/repo/business_card_repo";
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
import { FirebaseService } from "src/core/services/firebase.service";
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from "src/prisma.service";
import { CustomerDtm } from "src/core/domain/dtms/customer.dtm";

@Injectable()
export class WorkerFeature {

    constructor(
        private readonly prisma: PrismaService,
        private readonly accountRepo: AccountRepo,
        private readonly workerRepo: WorkerRepo,
        private readonly companyRepo: CompanyRepo,
        private readonly resourceRepo: ResourceRepo,
        private readonly userRepo: UserRepo,
        private readonly businessCardRepo: BusinessCardRepo,
        private readonly authentificationService: AuthentificationService,
        private readonly firebaseService: FirebaseService,
    ) {}

    async addWorker(context: CreateWorkerContext, accountDtm: AccountDtm): Promise<ApiResponse<WorkerDtm>> {
        try {
            const [country, account, company] = await Promise.all([
                this.resourceRepo.findCountry(context.country_id),
                this.accountRepo.fetchByLogin(context.number, context.country_id),
                this.companyRepo.findByAccount(accountDtm.id),
            ]);

            if (country == null) {
                return ApiResponseUtil.error('', 'Country not found .', 'not_found');
            }

            if (company == null) {
                return ApiResponseUtil.error('', 'Company not found .', 'not_found');
            }

            let worker: WorkerModel; 
                if (account != null) {
                    return ApiResponseUtil.error('', 'Account already exists .', 'conflict');
                }

                const find_user: UserModel | null = await this.userRepo.findByEmailOrNumber(context.email, context.number);

                if (find_user != null) {
                    return ApiResponseUtil.error('', 'Number or email already used .', 'conflict');
                }

                const password = await this.authentificationService.hashPassword(process.env.DEFAULT_ACCOUNT_PASSWORD ?? "Maaleek@2024!");
                const entity: EntityModel = await this.resourceRepo.findEntityByCode("Customer") as EntityModel;

                const newUser: UserModel = { id: uuidv4(), civility: context.civility, name: context.name, surname: context.surname, number: context.number, email: context.email };
                const newAccount: AccountModel = { id: uuidv4(), login: context.email, password, user: newUser, country: country!, entity, fcm_token: `${context.number}@fcm.com` , document_id : "" };
                const to_save: WorkerModel = { id: uuidv4(), account: newAccount, company };

                worker = await this.prisma.$transaction(async (tx) => {
                    const savedUser = await this.userRepo.save(newUser, tx);
                    newAccount.user = savedUser;
                    const savedAccount = await this.accountRepo.save(newAccount, tx);
                    to_save.account = savedAccount;
                    return this.workerRepo.save(to_save, tx);
                },{
                    timeout: 20000,
                });
            

            return ApiResponseUtil.ok(WorkerDtm.fromWorkerDtm(worker), '', 'Worker created 🎉 .');

        } catch (e) {
            return ApiResponseUtil.error('', "Failed to create worker .", "internal_error");
        }
    }

    async addExistingWorker(context: SearchWorkerContext, accountDtm : AccountDtm ): Promise<ApiResponse<WorkerDtm>> {
        try {
            const country = await this.resourceRepo.findCountry(context.country_id);
            if (country == null) {
                return ApiResponseUtil.error('', 'Country not found .', 'not_found');
            }
            const account = await this.accountRepo.fetchByLogin(context.number, country.id);
            if (account == null) {
                return ApiResponseUtil.error('', 'Account not found .', 'not_found');
            }

            const company = await this.companyRepo.findByAccount(accountDtm.id)

            if (company == null) {
                return ApiResponseUtil.error('', 'Company not found .', 'not_found');
            }

            const business_card = await this.businessCardRepo.findByUserId(account.user.id);


                if (business_card == null) {
                    return ApiResponseUtil.error('', 'Business card not found .', 'not_found');
                }

                const find_worker: WorkerModel | null = await this.workerRepo.findWorker(account.id);

                if (find_worker != null) {
                    return ApiResponseUtil.error('', 'This worker is already registered .', 'conflict');
                }

                const to_save: WorkerModel = { id: uuidv4(), account, company };

                const worker = await this.prisma.$transaction(async (tx) => {
                    const savedWorker = await this.workerRepo.save(to_save, tx);
                    business_card.company = company;
                    await this.businessCardRepo.save(business_card, tx);
                    return savedWorker;
                },{
                    timeout: 20000,
                });

                await this.firebaseService.toPush(account.fcm_token!, 'Travailleur ajouté 🎉', `Vous avez été ajouté en tant que travailleur dans l'entreprise. ${company.name}`);

                return ApiResponseUtil.ok(WorkerDtm.fromWorkerDtm(worker), '', 'Worker created 🎉 .');
        }
        catch (e) {
            return ApiResponseUtil.error('', "Failed to added worker .", "internal_error");
        }
    }


    async checkWorker(context : SearchWorkerContext) : Promise<ApiResponse<CustomerDtm | null>> {
        try {
            const country = await this.resourceRepo.findCountry(context.country_id);

            if (country == null) {
                return ApiResponseUtil.error('', 'Country not found .', 'not_found');
            }

            const account = await this.accountRepo.fetchByLogin(context.number, country.id);

            if (account == null) {
                return ApiResponseUtil.error('', 'Account not found .', 'not_found');
            }

            const worker = await this.workerRepo.findWorker(account.id);

            if (worker != null) {
                return ApiResponseUtil.error('', 'This worker is already registered .', 'conflict');
            }

            return ApiResponseUtil.ok(CustomerDtm.fromCustomerDtm(AccountDtm.fromAccountDtm(account)), '', 'Customer found 🎉 .');

        } catch (e) {
            return ApiResponseUtil.error('', "Failed to find customer .", "internal_error");

        }
    }

    async listingWorkers(state:string, accountDtm: AccountDtm): Promise<ApiResponse<WorkerDtm[]>> {
        const company: CompanyModel | null = await this.companyRepo.findByAccount(accountDtm.id);

        if (company == null) {
            return ApiResponseUtil.error('', 'Company not found .', 'not_found');
        }

        const workers = await this.workerRepo.findByCompany(state,company.id);
        return ApiResponseUtil.ok(workers.map(worker => WorkerDtm.fromWorkerDtm(worker)), '', 'Workers listed 🎉 .');
    }

    async removeWorker(worker_id: string): Promise<ApiResponse<WorkerDtm>> {
        try {
            const worker = await this.workerRepo.findById(worker_id);

            if (worker == null) {
                return ApiResponseUtil.error('', 'Worker not found .', 'not_found');
            }
            
            worker.state = 'out_of_service';
            await this.workerRepo.save(worker);
            return ApiResponseUtil.ok(WorkerDtm.fromWorkerDtm(worker), '', 'Worker removed 🎉 .');
        } catch (e) {
            return ApiResponseUtil.error('', "Failed to remove worker .", "internal_error");
        }
    }
}
