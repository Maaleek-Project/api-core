import { Injectable } from "@nestjs/common";
import {  CreatePaymentProviderContext } from "src/app/context/setup.context";
import { PaymentProviderRepo } from "src/app/repo/payment_provider_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { ProviderDtm } from "src/core/domain/dtms/provider.dtm";
import { ProviderModel } from "src/core/domain/models/provider.model";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentProviderFeature {

    constructor(
        private readonly providerRepo : PaymentProviderRepo,
    ) {}

    async createProvider(context : CreatePaymentProviderContext,  file: Express.Multer.File) : Promise<ApiResponse<ProviderDtm>> {
        try{

            const searching : ProviderModel | null = await this.providerRepo.findByLibelle(context.libelle);

            if(searching != null)
            {
                return ApiResponseUtil.error('Provider already exists .', 'conflict');
            }

            const provider : ProviderModel = { id : uuidv4(), libelle : context.libelle, activated : false, cover : file.filename, description : context.description};

            const saved = await this.providerRepo.save(provider);

            return ApiResponseUtil.ok(ProviderDtm.fromProviderDtm(saved), 'Provider created 🎉 .');

        }catch(e){
            console.log(e)
            return ApiResponseUtil.error("Failed to create provider .", "internal_error");
        }
    }

}