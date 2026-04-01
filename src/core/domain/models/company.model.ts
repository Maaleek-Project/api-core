import { AccountModel } from "./account.model";
import { AdvertisingModel } from "./advertising.model";
import { CompanySusbcriberModel } from "./company_susbcriber.model";
import { WorkerModel } from "./worker.model";

export interface CompanyModel {
    id : string ;
    name : string ;
    number : string ;
    email : string ;
    account : AccountModel;
    password : string ;
    address : string ;
    slogan? : string ;
    logo? : string;
    front_text_color? : string;
    back_text_color? : string;
    front_background_color? : string;
    back_background_color? : string;
    created_at? : Date;
    updated_at? : Date;
    locked? : boolean;
    advertising? : AdvertisingModel[];
    worker? : WorkerModel[];
    susbcriber? : CompanySusbcriberModel[];

}