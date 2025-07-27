import { CountryModel } from "../domain/models/country.model";
import { EntityModel } from "../domain/models/entity.model";

export interface IResourceRepo {
    getCountries(): Promise<CountryModel[]>;
    getEntities(): Promise<EntityModel[]>;

    findCountry(country_id: string): Promise<CountryModel | null>;
    findEntity(entity_id: string): Promise<EntityModel | null>;
}