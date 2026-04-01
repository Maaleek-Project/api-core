import { Injectable } from "@nestjs/common";
import { AdvertisingModel } from "src/core/domain/models/advertising.model";
import { IAdvertisingRepo } from "src/core/interfaces/i_advertising_repo";
import { PrismaService } from "src/prisma.service";

const ADVERTISING_INCLUDE = {
    company: {
        include: {
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
            advertising: true,
            worker: true,
            subscribers: true
        }
    }
} as const;

@Injectable()
export class AdvertisingRepo implements IAdvertisingRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async findById(id: string): Promise<AdvertisingModel | null> {
        const advertising = await this.prisma.advertising.findUnique({
            where: { id },
            include: ADVERTISING_INCLUDE
        });
        return advertising ? this.toAdvertising(advertising) : null;
    }

    async findByCompanyId(company_id: string): Promise<AdvertisingModel[]> {
        const advertisings = await this.prisma.advertising.findMany({
            where: { company_id },
            include: ADVERTISING_INCLUDE
        });
        return advertisings.map(a => this.toAdvertising(a));
    }

    async save(advertising: AdvertisingModel): Promise<AdvertisingModel> {
        const saved = await this.prisma.advertising.upsert({
            where: { id: advertising.id },
            update: this.toDatabase(advertising),
            create: this.toDatabase(advertising),
            include: ADVERTISING_INCLUDE
        });
        return this.toAdvertising(saved);
    }

    private toDatabase(advertising: AdvertisingModel): any {
        return {
            id: advertising.id,
            company_id: advertising.company.id,
            type: advertising.type,
            title: advertising.title,
            description: advertising.description,
            link: advertising.link ?? null,
            is_active: advertising.is_active,
            is_deleted: advertising.is_deleted
        };
    }

    private toAdvertising(advertising: any): AdvertisingModel {
        const c = advertising.company;
        return {
            id: advertising.id,
            company: {
                id: c.id,
                name: c.name,
                number: c.number,
                email: c.email,
                account: c.account,
                password: c.password,
                address: c.address,
                front_text_color: c.front_text_color,
                back_text_color: c.back_text_color,
                front_background_color: c.front_background_color,
                back_background_color: c.back_background_color,
                slogan: c.slogan,
                logo: c.logo,
                locked: c.locked,
                advertising: c.advertising,
                worker: c.worker,
                susbcriber: c.subscribers
            },
            type: advertising.type,
            title: advertising.title,
            description: advertising.description,
            link: advertising.link,
            created_at: advertising.created_at,
            updated_at: advertising.updated_at,
            is_active: advertising.is_active,
            is_deleted: advertising.is_deleted
        };
    }
}
