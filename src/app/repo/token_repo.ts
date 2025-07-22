import { Injectable } from "@nestjs/common";
import { TokenModel } from "src/core/domain/models/token.model";
import { ITokenRepo } from "src/core/interfaces/i_token_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class TokenRepo implements ITokenRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findByToken(key : string) : Promise<TokenModel | null> {
        const token = await this.prisma.token.findUnique({
            where: {token : key},
        });
        return token ? this.toTokenModel(token) : null;
    }

    async save(token : TokenModel) : Promise<TokenModel> {
        const saved = await this.prisma.token.upsert({
            where: {account_id : token.account_id},
            update: this.toDatabase(token),
            create: this.toDatabase(token)
        });
        return this.toTokenModel(saved);
    }

    async remove(accoun_id : number) : Promise<TokenModel> {
        const deleted = await this.prisma.token.delete({
            where: {account_id : accoun_id}
        });
        return this.toTokenModel(deleted);
    }

    private toTokenModel(token : any) : TokenModel {
        return {
            id: token.id,
            token: token.token,
            type: token.type,
            account_id: token.account_id,
            expired_at: token.expired_at,
            created_at: token.created_at,
        }
    }

    private toDatabase(token : TokenModel) : any {
        return {
            id: token.id,
            token: token.token,
            type: token.type,
            account_id: token.account_id,
            expired_at: token.expired_at,
        }
    }

}