import { AdvertisingType } from "@prisma/client";
import { CompanyModel } from "./company.model";

export interface AdvertisingModel {
    id : string;
    company : CompanyModel;
    type : AdvertisingType;
    title : string;
    description : string;
    is_active? : boolean;
    is_deleted? : boolean;
    link? : string;
    created_at? : Date;
    updated_at? : Date;
}
