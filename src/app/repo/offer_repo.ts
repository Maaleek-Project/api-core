import { Injectable } from "@nestjs/common";
import { OfferModel } from "src/core/domain/models/offer.model";
import { IOfferRepo } from "src/core/interfaces/i_offer_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class OfferRepo implements IOfferRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async searching(libelle : string, code : string) : Promise<OfferModel | null> {
        const offer = await this.prisma.offer.findFirst({
            where : {
                OR : [
                    {libelle},
                    {code}
                ]
            }
        })
        return offer ? this.toOffer(offer) : null;
    }

    async findAll() : Promise<OfferModel[]> {
        const offers = await this.prisma.offer.findMany();
        return offers.map(offer => this.toOffer(offer));
    }

    async save(offer : OfferModel) : Promise<OfferModel> {
        const saved = await this.prisma.offer.upsert({
            where: {id : offer.id},
            update: this.toDatabase(offer),
            create: this.toDatabase(offer)
        })
        return this.toOffer(saved);
    }

    private toOffer(offer : any) : OfferModel {
        return {
            id : offer.id,
            libelle : offer.libelle,
            sharing_number : offer.sharing_number,
            code : offer.code,
            created_at : offer.created_at
        }
    }

    private toDatabase(offer : OfferModel) : any {
        return {
            id : offer.id,
            libelle : offer.libelle,
            sharing_number : offer.sharing_number,
            code : offer.code
        }
    }
}