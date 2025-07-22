export class TokenModel {
    id : number;
    token : string;
    type : string;
    account_id : number;
    expired_at : Date;
    created_at? : Date;

    constructor(id : number, token : string, type : string, account_id : number, expired_at : Date, created_at : Date) {
        this.id = id;
        this.token = token;
        this.type = type;
        this.account_id = account_id;
        this.created_at = created_at;
        this.expired_at = expired_at;
    }    
}