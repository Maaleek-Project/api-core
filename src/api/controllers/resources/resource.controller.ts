import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { ResourceFeature } from "src/app/features/shared/resource.feature";

@Controller('resource')
export class ResourceController {

    constructor(
        private readonly feature: ResourceFeature,
    ) {}


    @Get("countries")
    async getCountries(@Res() res: Response) {
        const countries = await this.feature.getCountries();
        const statusMap: Record<string, number> = {
            success: 200,
            unauthorized: 401,
            not_found: 404,
        };
        const status = statusMap[countries.code] ;
        return res.status(status).json(countries);
    }

    @Get("entities")
    async getEntities(@Res() res: Response) {
        const entities = await this.feature.getEntities();
        const statusMap: Record<string, number> = {
            success: 200,
            unauthorized: 401,
            not_found: 404,
        };
        const status = statusMap[entities.code] ;
        return res.status(status).json(entities);
    }

}