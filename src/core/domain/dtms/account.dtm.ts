import { AccountModel } from "../models/account.model";
import { CountryDtm } from "./country.dtm";
import { EntityDtm } from "./entity.dtm";
import { TokenDtm } from "./token.dtm";
import { UserDtm } from "./user.dtm";

export class AccountDtm {
    id: number;
    user: UserDtm;
    country: CountryDtm;
    entity : EntityDtm;
    status?: string;
    locked?: boolean;
    created_at?: Date;
    updated_at?: Date;

    constructor(id: number,  user: UserDtm, country: CountryDtm, entity : EntityDtm, status?: string, locked?: boolean, created_at?: Date, updated_at?: Date) {
        this.id = id;
        this.user = user;
        this.country = country;
        this.entity = entity;
        this.status = status;
        this.locked = locked;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static fromAccountDtm(account: AccountModel): AccountDtm {
        return new AccountDtm(account.id,  UserDtm.fromUserDtm(account.user), CountryDtm.fromCountryDtm(account.country), EntityDtm.fromEntityDtm(account.entity), account.status, account.locked, account.created_at, account.updated_at);
    }
}