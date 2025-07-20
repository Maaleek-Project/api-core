import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ResourceRepo } from "./resource_repo";

@Module({
    imports: [
        
    ],
    controllers: [
    ],
    providers: [
        ResourceRepo,
        PrismaService
    ],
    exports: [
        ResourceRepo
    ],
})
export class RepoModule {}