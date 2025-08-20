import { Injectable } from "@nestjs/common";
import { OfferRepo } from "src/app/repo/offer_repo";
import { PaymentProviderRepo } from "src/app/repo/payment_provider_repo";
import { ResourceRepo } from "src/app/repo/resource_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { CountryDtm } from "src/core/domain/dtms/country.dtm";
import { OfferDtm } from "src/core/domain/dtms/offer.dtm";
import { ProviderDtm } from "src/core/domain/dtms/provider.dtm";

@Injectable()
export class SettingFeature {

    constructor(
        private readonly countryRepo : ResourceRepo,
        private readonly providerRepo : PaymentProviderRepo,
        private readonly offerRepo : OfferRepo,
    ) {

    }
    

    async getConfig() : Promise<ApiResponse<any>> {
        const countries = await this.countryRepo.getCountries();
        const providers = await this.providerRepo.getAll();
        const offers = await this.offerRepo.findAll();
        return ApiResponseUtil.ok({
            countries : countries.map(CountryDtm.fromCountryDtm),
            providers : providers.map(ProviderDtm.fromProviderDtm),
            offers : offers.map(OfferDtm.fromOfferDtm)
        },'', 'Config retrieved 🎉 .');
    }
}