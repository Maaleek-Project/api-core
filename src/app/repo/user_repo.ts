import { Injectable } from "@nestjs/common";
import { UserModel } from "src/core/domain/models/user.model";
import { IUserRepo } from "src/core/interfaces/i_user_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UserRepo implements IUserRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async save(model : UserModel) : Promise<UserModel> {
        const user = await this.prisma.user.upsert({
            where: {id : model.id},
            update: this.toDatabase(model),
            create: this.toDatabase(model)
        })
        return this.toUser(user);
    }

    // private function to transform the entity from the database to the DTO

    private toUser(user : any) : UserModel {
        return {
            id: user.id,
            civility: user.civility,
            name: user.name,
            surname: user.surname,
            picture: user.picture,
            birthdate: user.birthdate,
            number: user.number,
            created_at: user.created_at,
            updated_at: user.updated_at,
            businessCard: user.card
        }
    }

    private toDatabase(user : UserModel) : any {
        return {
            id: user.id,
            civility: user.civility,
            name: user.name,
            surname: user.surname,
            picture: user.picture,
            birthdate: user.birthdate,
            number: user.number
        }
    }

}