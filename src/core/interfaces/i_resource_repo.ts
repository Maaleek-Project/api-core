import { CountryModel } from "../domain/models/country.model";
import { EntityModel } from "../domain/models/entity.model";

export interface IResourceRepo {
    getCountries(): Promise<CountryModel[]>;
    getEntities(): Promise<EntityModel[]>;

    findCountry(country_id: number): Promise<CountryModel | null>;
    findEntity(entity_id: number): Promise<EntityModel | null>;
}