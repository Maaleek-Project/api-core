import { CompanyModel } from "./company.model";
import { OfferModel } from "./offer.model";
import { UserModel } from "./user.model";

export interface BusinessCardModel {
    id: string;
    user: UserModel;
    number : string;
    email : string;
    job : string;
    offer : OfferModel;
    company? : CompanyModel;
    created_at? : Date;
}