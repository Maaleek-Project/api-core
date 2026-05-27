import { Injectable } from "@nestjs/common";
import { BusinessCardViewModel } from "src/core/domain/models/business_card_view.model";
import { IBusinessCardViewRepo } from "src/core/interfaces/i_business_card_view_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class BusinessCardViewRepo implements IBusinessCardViewRepo {

    constructor(private readonly prisma: PrismaService) {}

    async save(view: BusinessCardViewModel): Promise<BusinessCardViewModel> {
        const saved = await this.prisma.businessCardView.create({
            data: {
                id              : view.id,
                viewer_id       : view.viewer_id,
                business_card_id: view.business_card_id,
            },
        });
        return this.toView(saved);
    }

    async countByBusinessCardId(business_card_id: string): Promise<number> {
        return this.prisma.businessCardView.count({ where: { business_card_id } });
    }

    async findViewersByBusinessCardId(business_card_id: string): Promise<BusinessCardViewModel[]> {
        const views = await this.prisma.businessCardView.findMany({
            where: { business_card_id },
            orderBy: { viewed_at: 'desc' },
        });
        return views.map(v => this.toView(v));
    }

    private toView(raw: any): BusinessCardViewModel {
        return {
            id              : raw.id,
            viewer_id       : raw.viewer_id,
            business_card_id: raw.business_card_id,
            viewed_at       : raw.viewed_at,
        };
    }
}
