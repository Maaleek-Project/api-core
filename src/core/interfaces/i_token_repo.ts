import { TokenModel } from "../domain/models/token.model";

export interface ITokenRepo {
    findByToken(token : string) : Promise<TokenModel | null>;
    save(token : TokenModel) : Promise<TokenModel>;
    remove(accoun_id : string) : Promise<TokenModel>;
}