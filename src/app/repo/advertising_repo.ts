import { Injectable } from "@nestjs/common";
import { AdvertisingModel } from "src/core/domain/models/advertising.model";
import { IAdvertisingRepo } from "src/core/interfaces/i_advertising_repo";
import { PrismaService } from "src/prisma.service";
import { CompanyRepo } from "./company_repo";

@Injectable()
export class AdvertisingRepo implements IAdvertisingRepo {

    constructor(
        private readonly prisma: PrismaService,
        private readonly companyRepo: CompanyRepo,
    ) {}

    async findById(id : string) : Promise<AdvertisingModel | null> {
        const advertising = await this.prisma.advertising.findUnique({
            where: {id : id},
            include: {
                company: true
            }
        })
        return advertising ? await this.toAdvertising(advertising) : null;
    }

    async findByCompanyId(company_id : string) : Promise<AdvertisingModel[]> {
        const advertisings = await this.prisma.advertising.findMany({
            where: {company_id : company_id},
            include: {
                company: true
            }
        })
        return Promise.all(advertisings.map(advertising => this.toAdvertising(advertising)));
    }

    async save(advertising : AdvertisingModel) : Promise<AdvertisingModel> {
        const saved = await this.prisma.advertising.upsert({
            where: {id : advertising.id},
            update: this.toDatabase(advertising),
            create: this.toDatabase(advertising),
            include: {
                company: true
            }
        })
        return await this.toAdvertising(saved);
    }

    private toDatabase(advertising : AdvertisingModel) : any {
        return {
            id : advertising.id,
            company_id : advertising.company.id,
            type : advertising.type,
            title : advertising.title,
            description : advertising.description,
            link : advertising.link
        }
    }

    private async toAdvertising(advertising : any) : Promise<AdvertisingModel> {
        // Récupérer la Company à partir de l'Account
        const company = await this.companyRepo.findByAccount(advertising.company.id);
        
        if (!company) {
            throw new Error(`Company not found for account ${advertising.company.id}`);
        }

        return {
            id : advertising.id,
            company : company,
            type : advertising.type,
            title : advertising.title,
            description : advertising.description,
            link : advertising.link,
            created_at : advertising.created_at,
            updated_at : advertising.updated_at
        }
    }
}
