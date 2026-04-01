import { OfferModel } from "../domain/models/offer.model";

export interface IOfferRepo {
    save(offer : OfferModel) : Promise<OfferModel>;
    findAll() : Promise<OfferModel[]>;
    findOffer(id : string) : Promise<OfferModel | null>;
    searching(libelle : string, code : string) : Promise<OfferModel | null>;
}