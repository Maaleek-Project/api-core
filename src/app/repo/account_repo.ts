import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AccountModel } from "src/core/domain/models/account.model";
import { IAccountRepo } from "src/core/interfaces/i_account_repo";
import { PrismaService } from "src/prisma.service";

const ACCOUNT_INCLUDE = {
    user: {
        include: {
            businessCard: {
                include: { offer: true }
            }
        }
    },
    country: true,
    entity: true,
    worker : {
        include : {
            company : true
        },
        where : {state : 'in_office'}
    } 
} as const;

@Injectable()
export class AccountRepo implements IAccountRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async findById(id: string): Promise<AccountModel | null> {
        const account = await this.prisma.account.findFirst({
            where: { id },
            include: ACCOUNT_INCLUDE
        });
        return account ? this.toAccount(account) : null;
    }

    async save(model: AccountModel, tx?: Prisma.TransactionClient): Promise<AccountModel> {
        const client = tx ?? this.prisma;
        const account = await client.account.upsert({
            where: { id: model.id },
            update: this.toDatabase(model),
            create: this.toDatabase(model),
            include: ACCOUNT_INCLUDE
        });
        return this.toAccount(account);
    }

    async fetchByLogin(login: string, country_id: string): Promise<AccountModel | null> {
        const account = await this.prisma.account.findFirst({
            where: { login, country_id },
            include: ACCOUNT_INCLUDE
        });
        return account ? this.toAccount(account) : null;
    }

    async fetchByIdentifiant(login: string): Promise<AccountModel | null> {
        const account = await this.prisma.account.findFirst({
            where: { login },
            include: ACCOUNT_INCLUDE
        });
        return account ? this.toAccount(account) : null;
    }

    async findAllCustomer(): Promise<AccountModel[]> {
        const accounts = await this.prisma.account.findMany({
            where: { entity: { code: 'Customer' } },
            include: ACCOUNT_INCLUDE
        });
        return accounts.map(account => this.toAccount(account));
    }

    private toAccount(account: any): AccountModel {
        return {
            id: account.id,
            login: account.login,
            password: account.password,
            fcm_token: account.fcm_token,
            user: account.user,
            country: account.country,
            entity: account.entity,
            status: account.status,
            state: account.state,
            document_id: account.document_id,
            locked: account.locked,
            created_at: account.created_at,
            updated_at: account.updated_at,
            worker : account.worker 
        };
    }

    private toDatabase(account: AccountModel): any {
        return {
            id: account.id,
            login: account.login,
            password: account.password,
            user_id: account.user.id,
            country_id: account.country.id,
            entity_id: account.entity.id,
            status: account.status,
            fcm_token: account.fcm_token,
            locked : account.locked,
            document_id: account.document_id
        };
    }
}
