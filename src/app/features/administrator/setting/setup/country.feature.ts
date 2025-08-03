import { Injectable } from "@nestjs/common";
import { CreateCountryContext } from "src/app/context/setup.context";
import { ResourceRepo } from "src/app/repo/resource_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { CountryDtm } from "src/core/domain/dtms/country.dtm";
import { CountryModel } from "src/core/domain/models/country.model";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CountryFeature {

    constructor(
        private readonly countryRepo : ResourceRepo,
    ) {}

    async createCountry(context : CreateCountryContext) : Promise<ApiResponse<CountryDtm>> {
        try{

            const searching : CountryModel | null = await this.countryRepo.searchCountry(context.alias, context.libelle, context.indicatif, context.flag);

            if(searching != null)
            {
                return ApiResponseUtil.error('Country already exists .', 'conflict');
            }

            const country : CountryModel = { id : uuidv4(), libelle : context.libelle, code : context.indicatif, alias : context.alias, flag : context.flag, currency : context.currency};

            const saved = await this.countryRepo.saveCountry(country);

            return ApiResponseUtil.ok(CountryDtm.fromCountryDtm(saved), 'Country created 🎉 .');

        }catch(e){
            console.log(e)
            return ApiResponseUtil.error("Failed to create country .", "internal_error");
        }
    }
}