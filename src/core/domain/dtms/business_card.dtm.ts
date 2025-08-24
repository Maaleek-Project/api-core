import { BusinessCardModel } from "../models/business_card.model";
import { UserDtm } from "./user.dtm";

export class BusinessCardDtm {
    id : string;
    user : UserDtm;
    number : string;
    email : string;
    job : string;

    constructor(id : string, user : UserDtm, number : string, email : string, job : string) {
        this.number = number;
        this.email = email;
        this.job = job;
        this.id = id;
        this.user = user;
    }

    static fromBusinessCardDtm(businessCard : BusinessCardModel) : BusinessCardDtm {
        return new BusinessCardDtm(businessCard.id, UserDtm.fromUserDtm(businessCard.user), businessCard.number, businessCard.email, businessCard.job);
    }
}