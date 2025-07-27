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
    birthdate? : Date;
    picture? : string;

    constructor(id : string, civility : string, name : string, surname : string, number : string, card : CardDtm, picture? : string, birthdate? : Date) {
        this.id = id;
        this.civility = civility;   
        this.name = name;
        this.surname = surname;
        this.picture = picture;
        this.birthdate = birthdate;
        this.card = card;
        this.number = number;
    }

    static fromUserDtm(user: UserModel): UserDtm {
        // console.log(user)
        return new UserDtm(user.id, user.civility, user.name, user.surname, user.number, CardDtm.fromCardDtm(user.businessCard![0]), user.picture, user.birthdate);
    }
}