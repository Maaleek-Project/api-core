import { OfferModel } from "../domain/models/offer.model";

export interface IOfferRepo {
    save(offer : OfferModel) : Promise<OfferModel>;
    findAll() : Promise<OfferModel[]>;
    searching(libelle : string, code : string) : Promise<OfferModel | null>;
}