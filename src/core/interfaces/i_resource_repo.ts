import { CountryModel } from "../domain/models/country.model";

export interface IResourceRepo {
    getCountries(): Promise<CountryModel[]>;
}