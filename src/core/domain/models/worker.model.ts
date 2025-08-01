import { AccountModel } from "./account.model";
import { CompanyModel } from "./company.model";

export interface WorkerModel {
    id : string;
    account : AccountModel;
    company : CompanyModel;
    state? : string;
    created_at? : Date;
    updated_at? : Date;
}