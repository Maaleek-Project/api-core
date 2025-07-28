import { CardModel } from "./card.model";

export interface UserModel {
    id : string;
    civility : string;
    name : string;
    surname : string;
    number : string;
    email? : string;
    businessCard? : CardModel;
    picture? : string;
    birthdate? : Date;
    created_at? : Date;
    updated_at? : Date;
}