import { Body, Controller, Get, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateCountryContext, CreateOfferContext, CreatePaymentProviderContext } from "src/app/context/setup.context";
import { PaymentProviderFeature } from "src/app/features/administrator/setting/setup/payment_provider.feature";
import { EntityTypeGuard } from "src/core/guards/entity_type.guard";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/validators/file.validator';
import { EntityType } from "src/core/decorators/entity_type.decorator";
import { CountryFeature } from "src/app/features/administrator/setting/setup/country.feature";
import { SettingFeature } from "src/app/features/administrator/setting/setting.feature";
import { OfferFeature } from "src/app/features/administrator/setting/setup/offer.feature";

@UseGuards(EntityTypeGuard)
@Controller('setup')
export class SetupController {
    
    constructor(
        private readonly provider: PaymentProviderFeature,
        private readonly country: CountryFeature,
        private readonly offer: OfferFeature,
        private readonly setting : SettingFeature,
    ) {}

    @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
    @EntityType(['Manager'])
    @Post('create-payment-provider')
    async createProvider(@Body() context : CreatePaymentProviderContext, @UploadedFile() cover: Express.Multer.File, @Res() res: Response) {
        const create = await this.provider.createProvider(context, cover);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            conflict: 409,
            internal_error: 500,
        };
        const status = statusMap[create.code] ;
        return res.status(status).json(create);
    }

    @EntityType(['Manager'])
    @Put('toogle-provider-status/:provider_id')
    async toogleProviderStatus(@Param('provider_id') provider_id : string, @Res() res: Response) {
        const create = await this.provider.toogleProviderStatus(provider_id);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            internal_error: 500,
        };
        const status = statusMap[create.code] ;
        return res.status(status).json(create);
    }

    @EntityType(['Manager'])
    @Get('get-providers')
    async getProviders(@Res() res: Response) {
        const providers = await this.provider.listing();
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            internal_error: 500,
        };
        const status = statusMap[providers.code] ;
        return res.status(status).json(providers);
    }

    @EntityType(['Manager'])
    @Post('create-country')
    async createCountry(@Body() context : CreateCountryContext, @Res() res: Response) {
        const create = await this.country.createCountry(context);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            conflict: 409,
            internal_error: 500,
        };
        const status = statusMap[create.code] ;
        return res.status(status).json(create);
    }

    @EntityType(['Manager'])
    @Put('toogle-country-status/:country_id')
    async toogleCountryStatus(@Param('country_id') country_id : string, @Res() res: Response) {
        const create = await this.country.toogleCountryStatus(country_id);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            internal_error: 500,
        };
        const status = statusMap[create.code] ;
        return res.status(status).json(create);
    }

    @EntityType(['Manager'])
    @Get('get-config')
    async getConfig(@Res() res: Response) {
        const config = await this.setting.getConfig();
        return res.status(200).json(config);
    }

    @EntityType(['Manager'])
    @Post('create-offer')
    async createOffer(@Body() context : CreateOfferContext, @Res() res: Response) {
        const create = await this.offer.createOffer(context);
        const statusMap: Record<string, number> = {
            success: 200,
            conflict: 409,
            internal_error: 500,
        };
        const status = statusMap[create.code] ;
        return res.status(status).json(create);
    }

    @EntityType(['Manager'])
    @Put('toogle-offer-status/:offer_id')
    async toogleOfferStatus(@Param('offer_id') offer_id : string, @Res() res: Response) {
        const create = await this.offer.toogleOfferStatus(offer_id);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            internal_error: 500,
        };
        const status = statusMap[create.code] ;
        return res.status(status).json(create);
    }

    @EntityType(['Manager'])
    @Get('get-offers')
    async getOffers(@Res() res: Response) {
        const offers = await this.offer.getOffers();
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            internal_error: 500,
        };
        const status = statusMap[offers.code] ;
        return res.status(status).json(offers);
    }   
    
}