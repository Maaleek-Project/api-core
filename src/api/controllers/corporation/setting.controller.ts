import { UseGuards, Controller, Get, Req, Res, Body, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { SettingFeature } from "src/app/features/manager/setting.feature";
import { EntityTypeGuard } from "src/core/guards/entity_type.guard";
import { Response } from "express";
import { EntityType } from "src/core/decorators/entity_type.decorator";
import { UpdateCompanyConfigContext } from "src/app/context/company.context";
import { FileInterceptor } from "@nestjs/platform-express";
import { editFileName, imageFileFilter } from "src/validators/file.validator";
import { diskStorage } from "multer";

@UseGuards(EntityTypeGuard)
@Controller('configuration')
export class SettingController {
    
    constructor(
        private readonly feature : SettingFeature,
    ) {}

    @EntityType(['Company'])
    @Get('company-info')
    async companyInfo(@Req() req: Request, @Res() res: Response) {
        const account = req['user'] 
        const listing = await this.feature.companyInfo(account);
        const statusMap: Record<string, number> = {
            success: 200,
            unauthorized: 401,
            not_found: 404,
            internal_error: 500,
        };
        const status = statusMap[listing.code] ;
        return res.status(status).json(listing);
    }   

    @EntityType(['Company'])
    @Put('update-config')
    async updateCompanyConfig(@Body() context : UpdateCompanyConfigContext, @Req() req: Request, @Res() res: Response) {
        const account = req['user'] 
        const listing = await this.feature.updateCompanyConfig(account, context);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            internal_error: 500,
        };
        const status = statusMap[listing.code] ;
        return res.status(status).json(listing);
    }

     @UseInterceptors(
            FileInterceptor('cover', {
                storage: diskStorage({
                    filename: editFileName,
                }),
                fileFilter: imageFileFilter,
            }),
        )
    @EntityType(['Company'])
    @Put('update-logo')
    async updateCompanyLogo(@Req() req: Request, @Res() res: Response, @UploadedFile() cover: Express.Multer.File) {
        const account = req['user'] 
        const logo = await this.feature.updateCompanyLogo(account, cover);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            internal_error: 500,
        };
        const status = statusMap[logo.code] ;
        return res.status(status).json(logo);
    }
}