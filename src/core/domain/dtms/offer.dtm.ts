import { OfferModel } from "../models/offer.model";

export class OfferDtm {
    id: string;
    libelle: string;
    sharing_number: number;
    code: string;
    badge_color : string;
    periodicity : number;
    price : number;
    description : string;
    is_active: boolean;
    created_at?: Date;



    constructor(id: string, libelle: string, sharing_number: number, code: string, badge_color: string, periodicity: number, price: number, description: string, is_active: boolean, created_at?: Date) {
        this.id = id;
        this.libelle = libelle;
        this.sharing_number = sharing_number;
        this.code = code;
        this.badge_color = badge_color;
        this.periodicity = periodicity;
        this.price = price;
        this.description = description;
        this.is_active = is_active;
        this.created_at = created_at;

    }

    static fromOfferDtm(offer: OfferModel): OfferDtm {
        return new OfferDtm(offer.id, offer.libelle, offer.sharing_number, offer.code, offer.badge_color, offer.periodicity, offer.price, offer.description, offer.is_active ?? false, offer.created_at);
    }
}