import { AccountModel } from "./account.model";

export interface CompanyModel {
    id : string ;
    name : string ;
    number : string ;
    email : string ;
    account : AccountModel;
    address : string ;
    created_at? : Date;
    updated_at? : Date;
}