import { Module } from "@nestjs/common";
import { CustomerController } from "./customer.controller";
import { PrismaService } from "src/prisma.service";
import { AccountRepo } from "src/app/repo/account_repo";
import { UserRepo } from "src/app/repo/user_repo";
import { ResourceRepo } from "src/app/repo/resource_repo";
import { AuthentificationService } from "src/core/services/authenfication.service";
import { CompanyController } from "./company.controller";
import { CompanyRepo } from "src/app/repo/company_repo";
import { CustomerFeature } from "src/app/features/administrator/user/customer.feature";
import { CompanyFeature } from "src/app/features/administrator/user/company.feature";
import { PaymentProviderFeature } from "src/app/features/administrator/setting/setup/payment_provider.feature";
import { SetupController } from "./setup.controller";
import { PaymentProviderRepo } from "src/app/repo/payment_provider_repo";
import { CountryFeature } from "src/app/features/administrator/setting/setup/country.feature";
import { SettingFeature } from "src/app/features/administrator/setting/setting.feature";
import { OfferFeature } from "src/app/features/administrator/setting/setup/offer.feature";
import { OfferRepo } from "src/app/repo/offer_repo";

@Module({
    imports: [],
    controllers: [
        CustomerController,
        CompanyController,
        SetupController
    ],
    providers: [
        AccountRepo,
        UserRepo,
        CompanyRepo,
        ResourceRepo,
        PaymentProviderRepo,
        PrismaService,
        OfferRepo,
        CustomerFeature,
        CompanyFeature,
        CountryFeature,
        SettingFeature,
        PaymentProviderFeature,
        OfferFeature,
        AuthentificationService
    ],
})
export class ManagementModule {}