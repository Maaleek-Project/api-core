import { Module } from "@nestjs/common";
import { CustomerController } from "./customer.controller";
import { PrismaService } from "src/prisma.service";
import { CustomerFeature } from "src/app/features/customer.feature";
import { AccountRepo } from "src/app/repo/account_repo";

@Module({
    imports: [],
    controllers: [
        CustomerController,
    ],
    providers: [
        AccountRepo,
        PrismaService,
        CustomerFeature
    ],
})
export class ManagementModule {}