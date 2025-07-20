import { Module } from "@nestjs/common";
import { ResourceController } from "./resource.controller";
import { ResourceFeature } from "src/app/features/resource.feature";
import { RepoModule } from "src/app/repo/repo.module";

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