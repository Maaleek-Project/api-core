import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { UserModel } from "src/core/domain/models/user.model";
import { IUserRepo } from "src/core/interfaces/i_user_repo";
import { PrismaService } from "src/prisma.service";

const USER_INCLUDE = {
    businessCard: {
        include: { offer: true }
    }
} as const;

@Injectable()
export class UserRepo implements IUserRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async save(model: UserModel, tx?: Prisma.TransactionClient): Promise<UserModel> {
        const client = tx ?? this.prisma;
        const user = await client.user.upsert({
            where: { id: model.id },
            update: this.toDatabase(model),
            create: this.toDatabase(model),
            include: USER_INCLUDE
        });
        return this.toUser(user);
    }

    async findByEmailOrNumber(email: string, number: string): Promise<UserModel | null> {
        const user = await this.prisma.user.findFirst({
            where: { OR: [{ email }, { number }] },
            include: USER_INCLUDE
        });
        return user ? this.toUser(user) : null;
    }

    async findByEmail(email: string): Promise<UserModel | null> {
        const user = await this.prisma.user.findFirst({
            where: { email },
            include: USER_INCLUDE
        });
        return user ? this.toUser(user) : null;
    }

    async findById(id: string): Promise<UserModel | null> {
        const user = await this.prisma.user.findFirst({
            where: { id },
            include: USER_INCLUDE
        });
        return user ? this.toUser(user) : null;
    }

    async findByNumber(number: string): Promise<UserModel | null> {
        const user = await this.prisma.user.findFirst({
            where: { number }
        });
        return user ? this.toUser(user) : null;
    }

    private toUser(user: any): UserModel {
        return {
            id: user.id,
            civility: user.civility,
            name: user.name,
            surname: user.surname,
            picture: user.picture,
            birthdate: user.birthdate,
            number: user.number,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
            businessCard: user.businessCard
        };
    }

    private toDatabase(user: UserModel): any {

        console.log(" ################ in toDabatse user repo ##################")
        console.log(user)
        console.log("##########################################")

        return {
            id: user.id,
            civility: user.civility,
            name: user.name,
            surname: user.surname,
            picture: user.picture,
            birthdate: user.birthdate,
            number: user.number,
            email: user.email
        };
    }
}
