import { Body, Controller, Delete, Post, Req, Res, Get, UseGuards } from "@nestjs/common";
import { CustomerFeature } from "src/app/features/customer.feature";
import { Response } from "express";
import { EntityType } from "src/core/decorators/entity_type.decorator";
import { EntityTypeGuard } from "src/core/guards/entity_type.guard";
import { CreateCustomerContext } from "src/app/context/customer.context";

@UseGuards(EntityTypeGuard)
@Controller('customer')
export class CustomerController {

    constructor(
        private readonly feature: CustomerFeature,
    ) {}


    @EntityType(['Manager'])
    @Get('listing')
    async listing(@Req() req: Request, @Res() res: Response) {
        const listing = await this.feature.listing();
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            internal_error: 500,
        };
        const status = statusMap[listing.code] ;
        return res.status(status).json(listing);
    }

    @EntityType(['Manager'])
    @Post('created')
    async createCustomer(@Body() context: CreateCustomerContext, @Req() req: Request, @Res() res: Response) {
        const create = await this.feature.createCustomer(context);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            conflict: 409,
            internal_error: 500,
        };
        const status = statusMap[create.code] ;
        return res.status(status).json(create);
    }

}