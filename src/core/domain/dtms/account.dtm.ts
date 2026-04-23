import { AccountModel } from "../models/account.model";
import { ExchangeRequestModel } from "../models/exchange_request.model";
import { CardDtm } from "./card.dtm";
import { CountryDtm } from "./country.dtm";
import { EntityDtm } from "./entity.dtm";
import { TokenDtm } from "./token.dtm";
import { UserDtm } from "./user.dtm";
import { WorkerDtm } from "./worker.dtm";

export class AccountDtm {
    id: string;
    login : string ;
    user: UserDtm;
    country: CountryDtm;
    entity : EntityDtm;
    document_id : string;
    status?: string;
    locked?: boolean;
    created_at?: Date;
    updated_at?: Date;
    worker : {
        company_name : string ;
        job_name : string ;
    } | null;
    sender : ExchangeRequestModel[] ;

    constructor(
        id: string, login : string , user: UserDtm, country: CountryDtm, entity : EntityDtm, document_id : string, 
        worker : { company_name : string ; job_name : string ;} | null,
        sender : ExchangeRequestModel[],
        status?: string, locked?: boolean, created_at?: Date, updated_at?: Date) {
        this.id = id;
        this.user = user;
        this.country = country;
        this.login = login;
        this.entity = entity;
        this.status = status;
        this.locked = locked;
        this.document_id = document_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.worker = worker;
        this.sender = sender;
    }

    static fromAccountDtm(account: AccountModel): AccountDtm {
        return new AccountDtm(account.id,  account.login , UserDtm.fromUserDtm(account.user), 
        CountryDtm.fromCountryDtm(account.country), EntityDtm.fromEntityDtm(account.entity), 
        account.document_id!, account.worker ? {
            company_name : account.worker && account.worker?.length > 0 ? account.worker[0].company.name : "",
            job_name : account.user.businessCard ? account.user.businessCard[0].job : "No business card"
        } : null ,account.sender ? account.sender : [], account.status, account.locked, account.created_at, account.updated_at
       
    );
    }
}