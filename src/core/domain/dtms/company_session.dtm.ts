import { CompanyModel } from "../models/company.model";

export class CompanySessionDtm {
    id: string;
    name : string;
    number : string;
    email : string;
    owner : {
        username : string;
        number : string;
        post :string;
    }

    constructor(id: string, name: string, number: string, email: string, owner: { username: string; number: string; post: string }) {
        this.id = id;
        this.name = name;
        this.number = number;
        this.email = email;
        this.owner = owner;
    }

    static fromCompanySessionDtm(company: CompanyModel): CompanySessionDtm {
        return new CompanySessionDtm(company.id, company.name, `+${company.account.country.code} ${company.number}`, company.email, {
            username : `${company.account.user.name} ${company.account.user.surname}`,
            number : `+${company.account.country.code} ${company.account.user.number}`,
            post : 'Co-Gérant'

        });
    }
}