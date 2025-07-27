import { TokenModel } from "../models/token.model";

export class TokenDtm {
    id : string;
    token : string;
    type : string;
    account_id : string;
    expired_at : Date;
    created_at? : Date;

    constructor(id : string, token : string, type : string, account_id : string, expired_at : Date, created_at? : Date) {
        this.id = id;
        this.token = token;
        this.type = type;
        this.account_id = account_id;
        this.created_at = created_at;
        this.expired_at = expired_at;
    }    

    static fromTokenDtm(token : TokenModel) : TokenDtm {
        return new TokenDtm(token.id, token.token, token.type, token.account_id, token.expired_at, token.created_at);
    }
}