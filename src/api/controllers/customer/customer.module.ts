import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { AccountRepo } from "src/app/repo/account_repo";
import { UserRepo } from "src/app/repo/user_repo";
import { PrismaService } from "src/prisma.service";
import { AuthentificationService } from "src/core/services/authenfication.service";
import { SettingFeature } from "src/app/features/customer/setting.feature";
import { MainFeature } from "src/app/features/customer/main.feature";
import { MainController } from "./main.controller";
import { NotificationRepo } from "src/app/repo/notification_repo";
import { ExchangeRequestRepo } from "src/app/repo/exchange_request_repo";
import { FirebaseService } from "src/core/services/firebase.service";

@Module({
    imports : [],
    controllers : [UserController, MainController],
    providers : [
        AccountRepo,
        UserRepo,
        NotificationRepo,
        ExchangeRequestRepo,
        PrismaService,
        MainFeature,
        SettingFeature,
        AuthentificationService,
        FirebaseService
    ]
})
export class UserModule {}