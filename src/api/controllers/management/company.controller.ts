import { Controller, Post, Res, UseGuards, Req, Body, Get } from "@nestjs/common";
import { EntityType } from "src/core/decorators/entity_type.decorator";
import { EntityTypeGuard } from "src/core/guards/entity_type.guard";
import { Response } from "express";
import { CreateCompanyContext } from "src/app/context/company.context";
import { CompanyFeature } from "src/app/features/administrator/user/company.feature";

@UseGuards(EntityTypeGuard)
@Controller('company')
export class CompanyController {

    constructor(
        private readonly companyFeature : CompanyFeature,
    ) {}

    @EntityType(['Manager'])
    @Get('listing')
    async listing(@Req() req: Request, @Res() res: Response) {
        const listing = await this.companyFeature.listing();
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
    async createCompany(@Body() context : CreateCompanyContext, @Req() req: Request, @Res() res: Response) {
        const create = await this.companyFeature.createCompany(context);
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