import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CompanyModel } from "src/core/domain/models/company.model";
import { ICompanyRepo } from "src/core/interfaces/i_company_repo";
import { PrismaService } from "src/prisma.service";

const COMPANY_INCLUDE = {
    account: {
        include: {
            user: {
                include: {
                    businessCard: {
                        include: { offer: true }
                    }
                }
            },
            country: true,
            entity: true
        }
    },
    advertising: {
        where: { is_deleted : false }
    },
    worker: {
        include :{
            account : {
                include : {
                    user : {
                        include : {
                            businessCard : true
                        }
                    },
                    country : true
                }
            },
            company : true
        }
    },
    subscribers: {
        include : {
            user : {
                include : {
                    businessCard: {
                        include: { offer: true }
                    }
                }
            } 
        }
    }
} as const;

@Injectable()
export class CompanyRepo implements ICompanyRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async findByAccount(account_id: string): Promise<CompanyModel | null> {
        const company = await this.prisma.company.findFirst({
            where: { owner_id: account_id },
            include: COMPANY_INCLUDE
        });
        return company ? this.toCompany(company) : null;
    }

    async findCompany(id: string): Promise<CompanyModel | null> {
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: COMPANY_INCLUDE
        });
        return company ? this.toCompany(company) : null;
    }

    async findAllCompanies(): Promise<CompanyModel[]> {
        const companies = await this.prisma.company.findMany({
            include: COMPANY_INCLUDE
        });
        return companies.map(company => this.toCompany(company));
    }

    async save(company: CompanyModel, tx?: Prisma.TransactionClient): Promise<CompanyModel> {
        const client = tx ?? this.prisma;
        const saved = await client.company.upsert({
            where: { id: company.id },
            update: this.toDatabase(company),
            create: this.toDatabase(company),
            include: COMPANY_INCLUDE
        });
        return this.toCompany(saved);
    }

    async findByNumerOrEmail(number: string, email: string): Promise<CompanyModel | null> {
        const company = await this.prisma.company.findFirst({
            where: { OR: [{ number }, { email }] },
            include: COMPANY_INCLUDE
        });
        return company ? this.toCompany(company) : null;
    }

    async findByEmail(email: string): Promise<CompanyModel | null> {
        const company = await this.prisma.company.findFirst({
            where: { email },
            include: COMPANY_INCLUDE
        });
        return company ? this.toCompany(company) : null;
    }

    private toDatabase(company: CompanyModel): any {
        return {
            id: company.id,
            name: company.name,
            number: company.number,
            email: company.email,
            owner_id: company.account.id,
            password: company.password,
            address: company.address,
            front_text_color: company.front_text_color,
            back_text_color: company.back_text_color,
            front_background_color: company.front_background_color,
            back_background_color: company.back_background_color,
            slogan: company.slogan,
            logo: company.logo,
            locked: company.locked,
        };
    }

    private toCompany(company: any): CompanyModel {
        return {
            id: company.id,
            name: company.name,
            number: company.number,
            email: company.email,
            account: company.account,
            password: company.password,
            address: company.address,
            created_at: company.created_at,
            front_text_color: company.front_text_color,
            back_text_color: company.back_text_color,
            front_background_color: company.front_background_color,
            back_background_color: company.back_background_color,
            slogan: company.slogan,
            logo: company.logo,
            locked: company.locked,
            advertising: company.advertising,
            worker: company.worker,
            susbcriber: company.subscribers
        };
    }
}
