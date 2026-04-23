import { CountryModel } from "./country.model";
import { EntityModel } from "./entity.model";
import { ExchangeRequestModel } from "./exchange_request.model";
import { UserModel } from "./user.model";
import { WorkerModel } from "./worker.model";

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
    worker? : [WorkerModel] | null;
    sender? : [ExchangeRequestModel] | null;
    register_in_app? : boolean;
}