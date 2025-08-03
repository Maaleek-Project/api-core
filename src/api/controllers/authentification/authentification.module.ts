import { Module } from "@nestjs/common";
import { AuthentificationService } from "src/core/services/authenfication.service";
import { AuthentificationController } from "./authentification.controller";
import { RepoModule } from "src/app/repo/repo.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthentificationFeature } from "src/app/features/shared/authentification.feature";

@Module({
    imports: [
        RepoModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
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