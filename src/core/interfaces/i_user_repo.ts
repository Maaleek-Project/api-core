import { UserModel } from "../domain/models/user.model";

export interface IUserRepo {
    save(user : UserModel) : Promise<UserModel>
    findByEmail(email : string) : Promise<UserModel | null>
    findByNumber(number : string) : Promise<UserModel | null>
    findByEmailOrNumber(email : string, number : string) : Promise<UserModel | null>
}