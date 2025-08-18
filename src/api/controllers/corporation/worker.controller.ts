import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { CreateWorkerContext } from "src/app/context/worker.context";
import { WorkerFeature } from "src/app/features/manager/worker.feature";
import { Response } from "express";
import { EntityTypeGuard } from "src/core/guards/entity_type.guard";
import { EntityType } from "src/core/decorators/entity_type.decorator";

@UseGuards(EntityTypeGuard)
@Controller('worker')
export class WorkerController {

    constructor(
        private readonly feature : WorkerFeature,
    ) {}

    @EntityType(['Company'])
    @Post('added')
    async addWorker(@Body() context : CreateWorkerContext,@Req() req: Request, @Res() res: Response) {
        const account = req['user'] 
        const worker = await this.feature.addWorker(context , account);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            conflict: 409,
            internal_error: 500,
        };
        const status = statusMap[worker.code] ;
        return res.status(status).json(worker);
    }

    @EntityType(['Company'])
    @Get('listing')
    async listingWorkers(@Req() req: Request, @Res() res: Response) {
        const account = req['user'] 
        const listing = await this.feature.listingWorkers(account);
        const statusMap: Record<string, number> = {
            success: 200,
            unauthorized: 401,
            not_found: 404,
            internal_error: 500,
        };
        const status = statusMap[listing.code] ;
        return res.status(status).json(listing);
    }

}