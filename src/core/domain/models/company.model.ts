import { AccountModel } from "./account.model";

export interface CompanyModel {
    id : string ;
    name : string ;
    number : string ;
    email : string ;
    account : AccountModel;
    address : string ;
    front_text_color? : string;
    back_text_color? : string;
    front_background_color? : string;
    back_background_color? : string;
    created_at? : Date;
    updated_at? : Date;

}