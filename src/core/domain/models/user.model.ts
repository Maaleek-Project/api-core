export interface UserModel {
    id : number;
    civility : string;
    name : string;
    surname : string;
    number : string;
    picture? : string;
    birthdate? : Date;
    created_at? : Date;
    updated_at? : Date;
}