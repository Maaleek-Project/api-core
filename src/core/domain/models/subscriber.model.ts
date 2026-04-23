import { CompanyModel } from "./company.model";
import { UserModel } from "./user.model";

export interface SubscriberModel {
    id : string;
    company : CompanyModel;
    user : UserModel;
    is_subscribed : boolean;
}