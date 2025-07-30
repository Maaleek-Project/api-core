import { CompanyModel } from "../models/company.model";
import { AccountDtm } from "./account.dtm";
import { CountryDtm } from "./country.dtm";

export class CompanyDtm {
    id: string;
    number: string;
    email: string;
    name: string;
    address: string;
    account : AccountDtm;
    created_at?: Date;

    constructor(id: string, number: string, email: string, name: string, address: string, account: AccountDtm, created_at?: Date) {
        this.id = id;
        this.number = number;
        this.email = email;
        this.name = name;
        this.address = address;
        this.account = account;
        this.created_at = created_at;
    }

    static fromCompanyDtm(company: CompanyModel): CompanyDtm {
        return new CompanyDtm(company.id, company.number, company.email, company.name, company.address, AccountDtm.fromAccountDtm(company.account), company.created_at);
    }
}