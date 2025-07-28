import { Module } from "@nestjs/common";
import { CustomerController } from "./customer.controller";
import { PrismaService } from "src/prisma.service";
import { CustomerFeature } from "src/app/features/customer.feature";
import { AccountRepo } from "src/app/repo/account_repo";
import { UserRepo } from "src/app/repo/user_repo";
import { ResourceRepo } from "src/app/repo/resource_repo";
import { AuthentificationService } from "src/core/services/authenfication.service";

@Module({
    imports: [],
    controllers: [
        CustomerController,
    ],
    providers: [
        AccountRepo,
        UserRepo,
        ResourceRepo,
        PrismaService,
        CustomerFeature,
        AuthentificationService
    ],
})
export class ManagementModule {}