import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { AccountRepo } from "src/app/repo/account_repo";
import { UserRepo } from "src/app/repo/user_repo";
import { PrismaService } from "src/prisma.service";
import { AuthentificationService } from "src/core/services/authenfication.service";
import { SettingFeature } from "src/app/features/customer/setting.feature";

@Module({
    imports : [],
    controllers : [UserController],
    providers : [
        AccountRepo,
        UserRepo,
        PrismaService,
        SettingFeature,
        AuthentificationService
    ]
})
export class UserModule {}