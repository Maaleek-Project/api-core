import { Injectable } from "@nestjs/common";
import { BusinessCardModel } from "src/core/domain/models/business_card.model";
import { IBusinessCardRepo } from "src/core/interfaces/i_business_card_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class BusinessCardRepo implements IBusinessCardRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async haveTheBusinessCardsReceived(senders_id : string[]) : Promise<BusinessCardModel[]> {
        const businessCards = await this.prisma.businessCard.findMany({
            where : {user_id : {
                in : senders_id
            }},
            include : {
                user : {
                    include : {
                        businessCard : true
                    }
                },
                company : true
            }
        })
        return businessCards.map(businessCard => this.toBusinessCard(businessCard));
    }

    private toBusinessCard(businessCard : any) : BusinessCardModel {
        return {
            id : businessCard.id,
            user : businessCard.user,
            number : businessCard.number,
            email : businessCard.email,
            job : businessCard.job,
            created_at : businessCard.created_at,
        };
    }
}