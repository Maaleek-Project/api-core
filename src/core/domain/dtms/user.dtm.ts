import { UserModel } from "../models/user.model";
import { CardDtm } from "./card.dtm";
import { CountryDtm } from "./country.dtm";

export class UserDtm {
    id : string;
    civility : string;
    name : string;
    surname : string;
    number : string;
    card : CardDtm;
    email? : string;
    birthdate? : Date;
    picture? : string;

    constructor(id : string, civility : string, name : string, surname : string, number : string, card : CardDtm,email? : string, picture? : string, birthdate? : Date) {
        this.id = id;
        this.civility = civility;   
        this.name = name;
        this.surname = surname;
        this.picture = picture;
        this.birthdate = birthdate;
        this.email = email;
        this.card = card;
        this.number = number;
    }

    static fromUserDtm(user: UserModel): UserDtm {
        return new UserDtm(user.id, user.civility, user.name, user.surname, user.number, CardDtm.fromCardDtm(user.businessCard![0]), user.email, user.picture, user.birthdate);
    }
}