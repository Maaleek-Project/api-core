import { Module } from "@nestjs/common";
import { AuthentificationService } from "src/core/services/authenfication.service";
import { AuthentificationController } from "./authentification.controller";
import { RepoModule } from "src/app/repo/repo.module";
import { AuthentificationFeature } from "src/app/features/authentification.feature";

@Module({
    imports: [
        RepoModule
    ],
    controllers: [
        AuthentificationController
    ],
    providers: [
        AuthentificationFeature,
        AuthentificationService
    ],
})
export class AuthentificationModule {}