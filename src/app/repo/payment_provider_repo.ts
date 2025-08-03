import { Injectable } from "@nestjs/common";
import { ProviderModel } from "src/core/domain/models/provider.model";
import { IPaymentProviderRepo } from "src/core/interfaces/i_payment_provider_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class PaymentProviderRepo implements IPaymentProviderRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getAll() : Promise<ProviderModel[]> {
        const providers = await this.prisma.paymentProvider.findMany();
        return providers.map(provider => this.toPaymentProvider(provider));
    }

    async findById(id : string) : Promise<ProviderModel | null> {
        const provider = await this.prisma.paymentProvider.findUnique({
            where: {id : id}
        })
        return provider ? this.toPaymentProvider(provider) : null;
    }

    async findByLibelle(libelle : string) : Promise<ProviderModel | null> {
        const provider = await this.prisma.paymentProvider.findUnique({
            where: {libelle : libelle}
        })
        return provider ? this.toPaymentProvider(provider) : null;
    }

    async save(provider : ProviderModel) : Promise<ProviderModel> {
        const saved = await this.prisma.paymentProvider.upsert({
            where: {id : provider.id},
            update: this.toDatabase(provider),
            create: this.toDatabase(provider)
        })
        return this.toPaymentProvider(saved);
    }


    private toDatabase(provider : ProviderModel) : any {
        return {
            id : provider.id,
            libelle : provider.libelle,
            activated : provider.activated,
            cover : provider.cover,
            description : provider.description
        }
    }

    private toPaymentProvider(provider : any) : ProviderModel {
        return {
            id : provider.id,
            libelle : provider.libelle,
            activated : provider.activated,
            cover : provider.cover,
            description : provider.description,
            created_at : provider.created_at,
            updated_at : provider.updated_at
        }
    }
}