import { CompanyModel } from "./company.model";
import { UserModel } from "./user.model";

export interface BusinessCardModel {
    id: string;
    user: UserModel;
    number : string;
    email : string;
    job : string;
    company? : CompanyModel;
    created_at? : Date;
}