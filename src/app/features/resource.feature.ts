import { Injectable } from "@nestjs/common";
import { ResourceRepo } from "../repo/resource_repo";
import { ApiResponse, ApiResponseUtil } from "../utils/api-response.util";
import { CountryDtm } from "src/core/domain/dtms/country.dtm";

@Injectable()
export class ResourceFeature {

    constructor(
        private readonly repo: ResourceRepo,
    ) {}


    async getCountries(): Promise<ApiResponse<CountryDtm[]>> {
        const countries = await this.repo.getCountries();
        return ApiResponseUtil.ok(countries.map(CountryDtm.fromCountryDtm), 'List of countries retrieved 🎉 .');
    }

}