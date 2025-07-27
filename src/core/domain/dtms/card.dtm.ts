import { CardModel } from "../models/card.model";
import { OfferDtm } from "./offer.dtm";

export class CardDtm {
    id: string;
    offer: OfferDtm;

    constructor(id: string, offer: OfferDtm) {
        this.id = id;
        this.offer = offer;
    }

    static fromCardDtm(card: CardModel): CardDtm {
        return new CardDtm(card.id, OfferDtm.fromOfferDtm(card.offer));
    }
}