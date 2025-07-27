export interface TokenModel {
    id : string;
    token : string;
    type : string;
    account_id : string;
    expired_at : Date;
    created_at? : Date;   
}