import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ResourceRepo } from "./resource_repo";
import { OtpRepo } from "./otp_repo";
import { AccountRepo } from "./account_repo";
import { UserRepo } from "./user_repo";
import { TokenRepo } from "./token_repo";
import { NotificationRepo } from "./notification_repo";
import { ExchangeRequestRepo } from "./exchange_request_repo";
import { BusinessCardRepo } from "./business_card_repo";
import { CompanyRepo } from "./company_repo";
import { SubscriberRepo } from "./subscriber_repo";

@Module({
    imports: [
        
    ],
    controllers: [
    ],
    providers: [
        ResourceRepo,
        OtpRepo,
        AccountRepo,
        UserRepo,
        TokenRepo,
        NotificationRepo,
        ExchangeRequestRepo,
        BusinessCardRepo,
        SubscriberRepo,
        CompanyRepo,
        PrismaService

    ],
    exports: [
        ResourceRepo,
        OtpRepo,
        UserRepo,
        AccountRepo,
        TokenRepo,
        NotificationRepo,
        ExchangeRequestRepo,
        CompanyRepo,
        BusinessCardRepo,
        SubscriberRepo,
        PrismaService
    ],
})
export class RepoModule {}