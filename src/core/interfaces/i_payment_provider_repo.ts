import { ProviderModel } from "../domain/models/provider.model";

export interface IPaymentProviderRepo {
    save(provider : ProviderModel) : Promise<ProviderModel>;
    findById(id : string) : Promise<ProviderModel | null>;
    findByLibelle(libelle : string) : Promise<ProviderModel | null>;
    getAll() : Promise<ProviderModel[]>;
}