import { CompanyModel } from "../models/company.model";
import { AdvertisingModel } from "../models/advertising.model";
import { AdvertisingDtm } from "./adversiting.dtm";

export class CompanyAdvertisingsDtm {

    company: {
        id                    : string;
        name                  : string;
        address               : string;
        logo                  : string | null;
        slogan                : string | null;
        front_text_color      : string | null;
        back_text_color       : string | null;
        front_background_color: string | null;
        back_background_color : string | null;
    };

    advertisings: AdvertisingDtm[];
    total       : number;

    constructor(
        company     : CompanyAdvertisingsDtm['company'],
        advertisings: AdvertisingDtm[],
    ) {
        this.company      = company;
        this.advertisings = advertisings;
        this.total        = advertisings.length;
    }

    static fromGroup(company: CompanyModel, ads: AdvertisingModel[]): CompanyAdvertisingsDtm {
        return new CompanyAdvertisingsDtm(
            {
                id                    : company.id,
                name                  : company.name,
                address               : company.address,
                logo                  : company.logo                  ?? null,
                slogan                : company.slogan                ?? null,
                front_text_color      : company.front_text_color      ?? null,
                back_text_color       : company.back_text_color       ?? null,
                front_background_color: company.front_background_color ?? null,
                back_background_color : company.back_background_color  ?? null,
            },
            ads.map(AdvertisingDtm.fromAdvertisingDtm),
        );
    }
}
