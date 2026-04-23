import { Injectable } from "@nestjs/common";
import { CompanyRepo } from "src/app/repo/company_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { CompanyDtm } from "src/core/domain/dtms/company.dtm";
import { ResourceRepo } from "src/app/repo/resource_repo";
import { CreateCompanyContext } from "src/app/context/company.context";
import { AccountRepo } from "src/app/repo/account_repo";
import { CompanyModel } from "src/core/domain/models/company.model";
import { AccountModel } from "src/core/domain/models/account.model";
import { UserRepo } from "src/app/repo/user_repo";
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from "src/core/domain/models/user.model";
import { AuthentificationService } from "src/core/services/authenfication.service";
import { EntityModel } from "src/core/domain/models/entity.model";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class CompanyFeature {

    constructor(
        private readonly prisma: PrismaService,
        private readonly companyRepo: CompanyRepo,
        private readonly resourceRepo: ResourceRepo,
        private readonly accountRepo: AccountRepo,
        private readonly userRepo: UserRepo,
        private readonly authentificationService: AuthentificationService,
    ) {}

    async listing(): Promise<ApiResponse<CompanyDtm[]>> {
        const companies = await this.companyRepo.findAllCompanies();
        return ApiResponseUtil.ok(companies.map(company => CompanyDtm.fromCompanyDtm(company)), '', 'Companies listed 🎉 .');
    }

    async createCompany(context: CreateCompanyContext): Promise<ApiResponse<CompanyDtm>> {
        try {
            const country = await this.resourceRepo.findCountry(context.country_id);

            if (country == null) {
                return ApiResponseUtil.error('', 'Country not found .', 'not_found');
            }

            const find_email_or_number: CompanyModel | null = await this.companyRepo.findByNumerOrEmail(context.company_number, context.company_email);

            if (find_email_or_number != null) {
                return ApiResponseUtil.error('', 'Company email or number is already used .', 'conflict');
            }

            const account: AccountModel | null = await this.accountRepo.fetchByLogin(context.manager_number, context.country_id);

            if (account != null) {
                return ApiResponseUtil.error('', 'Manager number is already used .', 'conflict');
            }

            const user: UserModel | null = await this.userRepo.findByEmail(context.manager_email);

            if (user != null) {
                return ApiResponseUtil.error('', 'Manager email is already used .', 'conflict');
            }

            const find_number: UserModel | null = await this.userRepo.findByNumber(context.manager_number);

            if (find_number != null) {
                return ApiResponseUtil.error('', 'This number is already used .', 'conflict');
            }

            const password = await this.authentificationService.hashPassword(process.env.DEFAULT_ACCOUNT_PASSWORD ?? "Maaleek@2024!");
            const entity: EntityModel = await this.resourceRepo.findEntityByCode("Company") as EntityModel;

            const newUser: UserModel = { id: uuidv4(), civility: context.manager_civility, name: context.manager_name, surname: context.manager_surname, number: context.manager_number, email: context.manager_email };
            const newAccount: AccountModel = { id: uuidv4(), login: context.manager_email, password, user: newUser, country: country!, entity, fcm_token: `${context.manager_number}@fcm`, document_id: "" };
            const newCompany: CompanyModel = { id: uuidv4(), name: context.company_name, number: context.company_number, email: context.company_email, account: newAccount, password, address: context.company_address };

            const saved_company = await this.prisma.$transaction(async (tx) => {
                const savedUser = await this.userRepo.save(newUser, tx);
                newAccount.user = savedUser;
                const savedAccount = await this.accountRepo.save(newAccount, tx);
                newCompany.account = savedAccount;
                return this.companyRepo.save(newCompany, tx);
            });

            return ApiResponseUtil.ok(CompanyDtm.fromCompanyDtm(saved_company), '', 'Company created 🎉 .');

        } catch (e) {
            return ApiResponseUtil.error('', "Failed to create company .", "internal_error");
        }
    }

    async toogleLock(company_id: string): Promise<ApiResponse<CompanyDtm>> {
        const company = await this.companyRepo.findCompany(company_id);
        if (company == null) {
            return ApiResponseUtil.error('Company not found', 'This company does not exist. Please try again with a different company .', 'not_found');
        }

        company.locked = !company.locked;
        await this.companyRepo.save(company);

        return ApiResponseUtil.ok(CompanyDtm.fromCompanyDtm(company), company.locked ? 'Company unlocked' : 'Company locked', 'This company was ' + (company.locked ? 'locked' : 'unlocked') + ' successfully .');
    }
}
