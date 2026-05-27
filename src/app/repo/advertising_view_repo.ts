import { Injectable } from "@nestjs/common";
import { AdvertisingViewModel } from "src/core/domain/models/advertising_view.model";
import { IAdvertisingViewRepo } from "src/core/interfaces/i_advertising_view_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AdvertisingViewRepo implements IAdvertisingViewRepo {

    constructor(private readonly prisma: PrismaService) {}

    async save(view: AdvertisingViewModel): Promise<AdvertisingViewModel> {
        const saved = await this.prisma.advertisingView.create({
            data: {
                id             : view.id,
                advertising_id : view.advertising_id,
                account_id     : view.account_id,
            },
        });
        return this.toView(saved);
    }

    async countByAdvertisingId(advertising_id: string): Promise<number> {
        return this.prisma.advertisingView.count({ where: { advertising_id } });
    }

    private toView(raw: any): AdvertisingViewModel {
        return {
            id             : raw.id,
            advertising_id : raw.advertising_id,
            account_id     : raw.account_id,
            viewed_at      : raw.viewed_at,
        };
    }
}
