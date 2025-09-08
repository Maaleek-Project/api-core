import { CountryModel } from "./country.model";
import { EntityModel } from "./entity.model";
import { UserModel } from "./user.model";

export interface AccountModel {
    id: string;
    login: string;
    password: string;
    user: UserModel;
    country : CountryModel;
    entity : EntityModel;
    fcm_token : string;
    document_id? : string;
    status? : string;
    state? : string;
    locked? : boolean;
    created_at? : Date;
    updated_at? : Date;
}