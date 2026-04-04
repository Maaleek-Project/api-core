import { OfferModel } from "./offer.model";

export interface CardModel {
    id: string;
    job : string;
    offer : OfferModel;
}