export interface InitiatedContext {
    login : string;
    country_id : string;
}

export interface ValidateCodeContext {
    code : string;
    country_id : string;
    value : string;
    type : string;
}

export interface SignUpContext {
    login : string;
    country_id : string;
    password : string;
    civility : string;
    name : string;
    surname : string;
    entity_id : string;
}

export interface SignInContext {
    login : string;
    password : string;
    country_id : string;
}