import { UserModel } from "../models/user.model";
import { CountryDtm } from "./country.dtm";

export class UserDtm {
    id_user : number;
    civility : string;
    name : string;
    surname : string;
    number : string;
    birthdate? : Date;
    picture? : string;

    constructor(id_user : number, civility : string, name : string, surname : string, number : string, picture? : string, birthdate? : Date) {
        this.id_user = id_user;
        this.civility = civility;   
        this.name = name;
        this.surname = surname;
        this.picture = picture;
        this.birthdate = birthdate;
        this.number = number;
    }

    static fromUserDtm(user: UserModel): UserDtm {
        return new UserDtm(user.id, user.civility, user.name, user.surname, user.number, user.picture, user.birthdate);
    }
}