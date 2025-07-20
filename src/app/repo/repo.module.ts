import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ResourceRepo } from "./resource_repo";
import { OtpRepo } from "./otp_repo";
import { AccountRepo } from "./account_repo";
import { UserRepo } from "./user_repo";

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
        PrismaService
    ],
    exports: [
        ResourceRepo,
        OtpRepo,
        UserRepo,
        AccountRepo,
    ],
})
export class RepoModule {}