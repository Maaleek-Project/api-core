import { AccountModel } from "../domain/models/account.model";

export interface IAccountRepo {
    fetchByLogin(login: string, country_id: string): Promise<AccountModel | null>;
    save(account : AccountModel) : Promise<AccountModel>
    findAllCustomer() : Promise<AccountModel[]>
}