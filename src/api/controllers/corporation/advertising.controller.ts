import { UseGuards, Controller, Post, Get, Req, Res, Body, UploadedFile, UseInterceptors, Param, Put, Delete } from "@nestjs/common";
import { AdvertisingFeature } from "src/app/features/manager/advertising.feature";
import { EntityTypeGuard } from "src/core/guards/entity_type.guard";
import { Response } from "express";
import { EntityType } from "src/core/decorators/entity_type.decorator";
import { CreateAdvertisingContext } from "src/app/context/advertising.context";
import { FileInterceptor } from "@nestjs/platform-express";
import { editFileName, mediaFileFilter } from "src/validators/file.validator";
import { diskStorage } from "multer";

@UseGuards(EntityTypeGuard)
@Controller('advertising')
export class AdvertisingController {
    
    constructor(
        private readonly feature : AdvertisingFeature,
    ) {}

    @UseInterceptors(
        FileInterceptor('media', {
            storage: diskStorage({
                destination: './upload',
                filename: editFileName,
            }),
            fileFilter: mediaFileFilter,
            limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
        }),
    )
    @EntityType(['Company'])
    @Post('create')
    async createAdvertising(@Req() req: Request, @Body() context: CreateAdvertisingContext, @UploadedFile() media: Express.Multer.File | undefined, @Res() res: Response) {
        const account = req['user'];
        const result = await this.feature.createAdvertising(account, context, media);
        const statusMap: Record<string, number> = {
            success: 200,
            bad_request: 400,
            not_found: 404,
            internal_error: 500,
        };
        const status = statusMap[result.code] || 500;
        return res.status(status).json(result);
    }

    @EntityType(['Company'])
    @Get('listing')
    async listingAdvertisings(@Req() req: Request, @Res() res: Response) {
        const account = req['user'] 
        const listing = await this.feature.listingAdvertisings(account);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            internal_error: 500,
        };
        const status = statusMap[listing.code] || 500;
        return res.status(status).json(listing);
    }

    @EntityType(['Company'])
    @Put('toogle-advertising/:id')
    async toogleAdvertising(@Req() req: Request, @Res() res: Response, @Param('id') id : string) {
        const account = req['user'] 
        const advertising = await this.feature.toogleAdvertising(id);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            internal_error: 500,
        };
        const status = statusMap[advertising.code] || 500;
        return res.status(status).json(advertising);
    }

    @EntityType(['Company'])
    @Delete('delete-advertising/:id')
    async deleteAdvertising(@Req() req: Request, @Res() res: Response, @Param('id') id : string) {
        const account = req['user']
        const advertising = await this.feature.deleteAdvertising(id);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            internal_error: 500,
        };
        const status = statusMap[advertising.code] || 500;
        return res.status(status).json(advertising);
    }

    @EntityType(['Customer', 'Company', 'Manager'])
    @Post(':id/view')
    async recordView(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const account = req['user'];
        const result = await this.feature.recordView(account.id, id);
        const statusMap: Record<string, number> = {
            success      : 200,
            not_found    : 404,
            internal_error: 500,
        };
        return res.status(statusMap[result.code] || 500).json(result);
    }

    @EntityType(['Customer', 'Company', 'Manager'])
    @Get('all-by-company')
    async listingAllByCompany(@Res() res: Response) {
        const result = await this.feature.listingAllByCompany();
        const statusMap: Record<string, number> = {
            success: 200,
            internal_error: 500,
        };
        const status = statusMap[result.code] || 500;
        return res.status(status).json(result);
    }

}

