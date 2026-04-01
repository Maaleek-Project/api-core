import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { UserRepo } from "src/app/repo/user_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from "@nestjs/common";
import { AccountRepo } from "src/app/repo/account_repo";
import { CreateCustomerContext } from "src/app/context/customer.context";
import { ResourceRepo } from "src/app/repo/resource_repo";
import { AccountModel } from "src/core/domain/models/account.model";
import { UserModel } from "src/core/domain/models/user.model";
import { AuthentificationService } from "src/core/services/authenfication.service";
import { EntityModel } from "src/core/domain/models/entity.model";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class CustomerFeature {

    constructor(
        private readonly prisma: PrismaService,
        private readonly accountRepo: AccountRepo,
        private readonly userRepo: UserRepo,
        private readonly resourceRepo: ResourceRepo,
        private readonly authentificationService: AuthentificationService,
    ) {}

    async listing(): Promise<ApiResponse<AccountDtm[]>> {
        const customers = await this.accountRepo.findAllCustomer();
        return ApiResponseUtil.ok(customers.map(account => AccountDtm.fromAccountDtm(account)), '', 'Customers listed 🎉 .');
    }

    async createCustomer(context: CreateCustomerContext): Promise<ApiResponse<AccountDtm>> {
        try {
            const country = await this.resourceRepo.findCountry(context.country_id);

            if (country == null) {
                return ApiResponseUtil.error('', 'Country not found .', 'not_found');
            }

            const existing = await this.accountRepo.fetchByLogin(context.number, context.country_id);

            if (existing != null) {
                return ApiResponseUtil.error('', 'Account already exists .', 'conflict');
            }

            const find_email = await this.userRepo.findByEmail(context.email);

            if (find_email != null) {
                return ApiResponseUtil.error('', 'This email is already used .', 'conflict');
            }

            const find_number = await this.userRepo.findByNumber(context.number);

            if (find_number != null) {
                return ApiResponseUtil.error('', 'This number is already used .', 'conflict');
            }

            const password = await this.authentificationService.hashPassword(process.env.DEFAULT_ACCOUNT_PASSWORD ?? "Maaleek@2024!");
            const entity: EntityModel = await this.resourceRepo.findEntityByCode("Customer") as EntityModel;

            const newUser: UserModel = { id: uuidv4(), civility: context.civility, name: context.name, surname: context.surname, number: context.number, email: context.email };
            const newAccount: AccountModel = { id: uuidv4(), login: context.number, password, user: newUser, country: country!, entity, fcm_token: `${context.number}@fcm`, document_id: `${context.number}@doc` };

            const saved = await this.prisma.$transaction(async (tx) => {
                const savedUser = await this.userRepo.save(newUser, tx);
                newAccount.user = savedUser;
                return this.accountRepo.save(newAccount, tx);
            });

            return ApiResponseUtil.ok(AccountDtm.fromAccountDtm(saved), '', 'Customer created 🎉 .');

        } catch (e) {
            console.log(e);
            return ApiResponseUtil.error('', "Failed to create customer .", "internal_error");
        }
    }
}
