import { CountryModel } from "../models/country.model";

export class CountryDtm {
    id: string;
    libelle: string;
    code: string;
    alias: string;
    flag: string;
    currency: string;

    constructor(id: string, libelle: string, code: string, alias: string, flag: string, currency: string) {
        this.id = id;
        this.libelle = libelle;
        this.code = code;
        this.alias = alias;
        this.flag = flag;
        this.currency = currency;
    }

    static fromCountryDtm(country: CountryModel): CountryDtm {
        return new CountryDtm(country.id, country.libelle, country.code, country.alias, country.flag, country.currency);
    }
}