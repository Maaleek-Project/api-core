import { Module } from "@nestjs/common";
import { ResourceController } from "./resource.controller";
import { RepoModule } from "src/app/repo/repo.module";
import { ResourceFeature } from "src/app/features/shared/resource.feature";

@Module({
    imports: [
        RepoModule
    ],
    controllers: [
        ResourceController,
    ],
    providers: [
        ResourceFeature
    ],
})
export class ResourceModule {}