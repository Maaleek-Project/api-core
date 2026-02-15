import { AdvertisingModel } from "../domain/models/advertising.model";

export interface IAdvertisingRepo {
    save(advertising : AdvertisingModel) : Promise<AdvertisingModel>;
    findById(id : string) : Promise<AdvertisingModel | null>;
    findByCompanyId(company_id : string) : Promise<AdvertisingModel[]>;
}
