import { Injectable } from "@nestjs/common";
import { CountryModel } from "src/core/domain/models/country.model";
import { IResourceRepo } from "src/core/interfaces/i_resource_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ResourceRepo implements IResourceRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getCountries(): Promise<CountryModel[]> {
        const countries = await this.prisma.country.findMany();
        return countries.map(this.toCountry);
    }




    private toCountry(country : any) : CountryModel {
        return {
            id: country.id,
            libelle: country.libelle,
            code: country.code,
            alias: country.alias,
            flag: country.flag,
            currency: country.currency,
        };
    }

}