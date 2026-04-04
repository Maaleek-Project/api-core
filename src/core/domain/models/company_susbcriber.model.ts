import { CompanyModel } from "./company.model";
import { UserModel } from "./user.model";

export interface CompanySusbcriberModel {
    id : string ;
    company : CompanyModel;
    user : UserModel;
    is_subscribed : boolean;
    created_at? : string;
}