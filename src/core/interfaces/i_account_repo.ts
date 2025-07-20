import { AccountModel } from "../domain/models/account.model";

export interface IAccountRepo {
    fetchByLogin(login: string, country_id: number): Promise<AccountModel | null>;
    save(account : AccountModel) : Promise<AccountModel>
}