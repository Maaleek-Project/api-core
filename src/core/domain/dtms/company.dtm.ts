import { CompanyModel } from "../models/company.model";
import { AccountDtm } from "./account.dtm";
import { CountryDtm } from "./country.dtm";

export class CompanyDtm {
    id: string;
    number: string;
    email: string;
    name: string;
    address: string;
    owner : {
        username : string;
        number : string;
    };
    locked : boolean;
    pubs : number;
    workers : number;
    susbcribers : number;
    created_at?: Date;

    constructor(id: string, number: string, email: string, name: string, address: string, account: AccountDtm, locked : boolean , pubs : number, workers : number, susbcribers : number, created_at?: Date) {
        this.id = id;
        this.number = `+225 ${account.country.code} ${number}`;
        this.email = email;
        this.name = name;
        this.address = address;
        this.owner = {
            username : `${account.user.name} ${account.user.surname}`,
            number : `+225 ${account.country.code} ${account.user.number}`
        };
        this.locked = locked;
        this.created_at = created_at;
        this.pubs = pubs;
        this.workers = workers;
        this.susbcribers = susbcribers;

    }

    static fromCompanyDtm(company: CompanyModel): CompanyDtm {
        return new CompanyDtm(company.id, company.number, company.email, company.name, company.address, AccountDtm.fromAccountDtm(company.account), company.locked ?? false , company.advertising?.length ?? 0 , company.worker?.length ?? 0 , company.susbcriber?.length ?? 0 , company.created_at);
    }
}