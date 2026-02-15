import { CompanyModel } from "./company.model";

export interface AdvertisingModel {
    id : string;
    company : CompanyModel;
    type : string;
    title : string;
    description : string;
    link : string;
    created_at? : Date;
    updated_at? : Date;
}
