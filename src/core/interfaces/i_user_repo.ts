import { UserModel } from "../domain/models/user.model";

export interface IUserRepo {
    save(user : UserModel) : Promise<UserModel>
}