import { AccountModel } from "../models/account.model";
import { CardDtm } from "./card.dtm";
import { CountryDtm } from "./country.dtm";
import { EntityDtm } from "./entity.dtm";
import { TokenDtm } from "./token.dtm";
import { UserDtm } from "./user.dtm";

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

    constructor(id: string, login : string , user: UserDtm, country: CountryDtm, entity : EntityDtm, document_id : string, status?: string, locked?: boolean, created_at?: Date, updated_at?: Date) {
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
    }

    static fromAccountDtm(account: AccountModel): AccountDtm {
        return new AccountDtm(account.id,  account.login , UserDtm.fromUserDtm(account.user), CountryDtm.fromCountryDtm(account.country), EntityDtm.fromEntityDtm(account.entity), account.document_id!, account.status, account.locked, account.created_at, account.updated_at);
    }
}