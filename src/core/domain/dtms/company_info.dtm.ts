import { CompanyModel } from "../models/company.model";

export class CompanyInfoDtm {
    id : string ;
    name : string;
    number : string;
    address : string;
    country: string;
    manager : {
        username : string;
        number : string;
        email : string;
    };
    card : {
        front_text_color : string;
        back_text_color : string;
        front_background_color : string;
        back_background_color : string;
    }

    constructor(id : string, name : string, number : string, address : string, country : string, manager : {username : string, number : string, email : string},
        card : {
            front_text_color : string;
            back_text_color : string;
            front_background_color : string;
            back_background_color : string;
        }
    ){
        this.id = id ;
        this.name = name;
        this.number = number;
        this.address = address;
        this.country = country;
        this.manager = manager;
        this.card = card;
    }

    static fromCompanyInfoDtm(company : CompanyModel) : CompanyInfoDtm {
        return new CompanyInfoDtm(company.id, company.name, company.number, company.address, 
            company.account.country.libelle, 
            {
                username : `${company.account.user.name} ${company.account.user.surname}`,
                number : company.account.user.number,
                email : company.account.user.email ?? ''
            },
            {
                front_text_color : company.front_text_color ?? '0xff000000',
                back_text_color : company.back_text_color ?? '0xff000000',
                front_background_color : company.front_background_color ?? '0xffffffff',                
                back_background_color : company.back_background_color ?? '0xfff5f5f5'
            }
        );
    }
}