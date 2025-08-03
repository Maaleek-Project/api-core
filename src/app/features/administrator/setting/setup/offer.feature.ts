import { Injectable } from "@nestjs/common";
import { CreateOfferContext } from "src/app/context/setup.context";
import { OfferRepo } from "src/app/repo/offer_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { OfferDtm } from "src/core/domain/dtms/offer.dtm";
import { OfferModel } from "src/core/domain/models/offer.model";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OfferFeature {

    constructor(
        private readonly offerRepo : OfferRepo,
    ) {}


    async getOffers() : Promise<ApiResponse<OfferDtm[]>> {
        const offers = await this.offerRepo.findAll();
        return ApiResponseUtil.ok(offers.map(OfferDtm.fromOfferDtm), 'List of offers retrieved 🎉 .');
    }

    async createOffer(context : CreateOfferContext) : Promise<ApiResponse<OfferDtm>> {
        try{

            const searching : OfferModel | null = await this.offerRepo.searching(context.libelle, context.code);

            if(searching != null)
            {
                return ApiResponseUtil.error('Offer already exists .', 'conflict');
            }

            const offer : OfferModel = { id : uuidv4(), libelle : context.libelle, sharing_number : parseInt(context.shared_number), code : context.code};

            const saved = await this.offerRepo.save(offer);

            return ApiResponseUtil.ok(OfferDtm.fromOfferDtm(saved), 'Offer created 🎉 .');

        }catch(e){
            console.log(e)
            return ApiResponseUtil.error("Failed to create offer .", "internal_error");
        }

    }
}