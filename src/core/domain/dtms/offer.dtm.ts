import { OfferModel } from "../models/offer.model";

export class OfferDtm {
    id: string;
    libelle: string;
    sharing_number: number;
    code: string;

    constructor(id: string, libelle: string, sharing_number: number, code: string) {
        this.id = id;
        this.libelle = libelle;
        this.sharing_number = sharing_number;
        this.code = code;
    }

    static fromOfferDtm(offer: OfferModel): OfferDtm {
        return new OfferDtm(offer.id, offer.libelle, offer.sharing_number, offer.code);
    }
}