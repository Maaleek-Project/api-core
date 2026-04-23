import { CompanyDtm } from "./company.dtm";

export class CompanyKPIDtm {
    id : string ;
    name : string;
    logo : string;
    number_of_employees : number;
    current_user_is_already_subscribed : boolean;
    number_of_views : number;

    constructor(id : string, name : string , logo : string, number_of_employees : number, number_of_views : number , current_user_is_already_subscribed : boolean) {
        this.id = id;
        this.name = name;
        this.number_of_employees = number_of_employees;
        this.logo = logo;
        this.number_of_views = number_of_views;
        this.current_user_is_already_subscribed = current_user_is_already_subscribed;
    }

    static fromCompanyKPIDtm(company: CompanyDtm, user_id : string): CompanyKPIDtm { 
        const subscriber = company.details.subscribers?.find(s => s.user.id == user_id);
        return new CompanyKPIDtm(company.id, company.name, company.logo, company.workers, 0, subscriber?.is_subscribed ?? false);
    }
}