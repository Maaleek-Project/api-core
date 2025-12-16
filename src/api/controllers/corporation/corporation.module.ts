import { Module } from "@nestjs/common";
import { WorkerFeature } from "src/app/features/manager/worker.feature";
import { WorkerController } from "./worker.controller";
import { AccountRepo } from "src/app/repo/account_repo";
import { UserRepo } from "src/app/repo/user_repo";
import { CompanyRepo } from "src/app/repo/company_repo";
import { ResourceRepo } from "src/app/repo/resource_repo";
import { PrismaService } from "src/prisma.service";
import { WorkerRepo } from "src/app/repo/worker_repo";
import { AuthentificationService } from "src/core/services/authenfication.service";
import { FirebaseService } from "src/core/services/firebase.service";
import { SettingFeature } from "src/app/features/manager/setting.feature";
import { SettingController } from "./setting.controller";
import { R2Service } from "src/core/services/r2.service";

@Module({
    imports: [],
    controllers: [WorkerController, SettingController],
    providers: [
        AccountRepo,
        UserRepo,
        CompanyRepo,
        ResourceRepo,
        WorkerRepo,
        PrismaService,
        WorkerFeature,
        AuthentificationService,
        FirebaseService,
        R2Service,
        SettingFeature
    ],

})
export class CorporateModule {}