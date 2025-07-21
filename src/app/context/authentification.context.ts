export interface InitiatedContext {
    login : string;
    country_id : number;
}

export interface ValidateCodeContext {
    code : string;
    country_id : number;
    value : string;
    type : string;
}

export interface SignUpContext {
    login : string;
    country_id : number;
    password : string;
    civility : string;
    name : string;
    surname : string;
    entity_id : number;
}

export interface SignInContext {
    login : string;
    password : string;
    country_id : number;
}