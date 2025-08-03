import { Injectable } from "@nestjs/common";
import { ResourceRepo } from "src/app/repo/resource_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { CountryDtm } from "src/core/domain/dtms/country.dtm";
import { EntityDtm } from "src/core/domain/dtms/entity.dtm";

@Injectable()
export class ResourceFeature {

    constructor(
        private readonly repo: ResourceRepo,
    ) {}


    async getCountries(): Promise<ApiResponse<CountryDtm[]>> {
        const countries = await this.repo.getCountries();
        return ApiResponseUtil.ok(countries.map(CountryDtm.fromCountryDtm), 'List of countries retrieved 🎉 .');
    }

    async getEntities(): Promise<ApiResponse<EntityDtm[]>> {
        const entities = await this.repo.getEntities();
        return ApiResponseUtil.ok(entities.map(EntityDtm.fromEntityDtm), 'List of entities retrieved 🎉 .');
    }

}