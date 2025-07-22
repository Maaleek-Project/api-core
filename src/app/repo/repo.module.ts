import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ResourceRepo } from "./resource_repo";
import { OtpRepo } from "./otp_repo";
import { AccountRepo } from "./account_repo";
import { UserRepo } from "./user_repo";
import { TokenRepo } from "./token_repo";

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
        PrismaService
    ],
    exports: [
        ResourceRepo,
        OtpRepo,
        UserRepo,
        AccountRepo,
        TokenRepo
    ],
})
export class RepoModule {}