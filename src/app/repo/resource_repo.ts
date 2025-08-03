import { Injectable } from "@nestjs/common";
import { CountryModel } from "src/core/domain/models/country.model";
import { EntityModel } from "src/core/domain/models/entity.model";
import { IResourceRepo } from "src/core/interfaces/i_resource_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ResourceRepo implements IResourceRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async searchCountry(alias : string, libelle : string, code : string , flag: string) : Promise<CountryModel | null> {
        const country = await this.prisma.country.findFirst({
            where : {
                OR : [
                    {alias},
                    {libelle},
                    {code},
                    {flag}
                ]
            }
        })
        return country ? this.toCountry(country) : null;
    }

    async saveCountry(country : CountryModel) : Promise<CountryModel> {
        const saved = await this.prisma.country.upsert({
            where: {alias : country.alias},
            update: this.toDatabase(country),
            create: this.toDatabase(country)
        })
        return this.toCountry(saved);
    }

    async getCountries(): Promise<CountryModel[]> {
        const countries = await this.prisma.country.findMany();
        return countries.map(this.toCountry);
    }

    async getEntities(): Promise<EntityModel[]> {
        const entities = await this.prisma.entity.findMany();
        return entities.map(this.toEntity);
    }

    async findCountry(country_id: string): Promise<CountryModel | null> {
        const country = await this.prisma.country.findUnique({
            where: {id : country_id}
        })
        return country ? this.toCountry(country) : null;
    }

    async findEntity(entity_id: string): Promise<EntityModel | null> {
        const entity = await this.prisma.entity.findUnique({
            where: {id : entity_id}
        })
        return entity ? this.toEntity(entity) : null;
    }

    async findEntityByCode(code: string): Promise<EntityModel | null> {
        const entity = await this.prisma.entity.findUnique({
            where: {code : code}
        })
        return entity ? this.toEntity(entity) : null;
    }


    // private function to transform the entity from the database to the DTO

    private toEntity(entity: any): EntityModel  {
        return {
            id: entity.id,
            libelle: entity.libelle,
            code: entity.code,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
        };
    }

    private toCountry(country : any) : CountryModel {
        return {
            id: country.id,
            libelle: country.libelle,
            code: country.code,
            alias: country.alias,
            flag: country.flag,
            currency: country.currency,
            created_at: country.created_at,
            updated_at: country.updated_at,
        };
    }


    private toDatabase(country : CountryModel) : any {
        return {
            id : country.id,
            libelle : country.libelle,
            code : country.code,
            alias : country.alias,
            flag : country.flag,
            currency : country.currency,
        }
    }

}