import { Injectable } from "@nestjs/common";
import {  CreatePaymentProviderContext } from "src/app/context/setup.context";
import { PaymentProviderRepo } from "src/app/repo/payment_provider_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { ProviderDtm } from "src/core/domain/dtms/provider.dtm";
import { ProviderModel } from "src/core/domain/models/provider.model";
import { R2Service } from "src/core/services/r2.service";
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Injectable()
export class PaymentProviderFeature {

    constructor(
        private readonly providerRepo : PaymentProviderRepo,
        private readonly r2Service: R2Service,
    ) {}

    async createProvider(context : CreatePaymentProviderContext,  file: Express.Multer.File) : Promise<ApiResponse<ProviderDtm>> {
        try{

            const searching : ProviderModel | null = await this.providerRepo.findByLibelle(context.libelle);

            if(searching != null)
            {
                return ApiResponseUtil.error('','Provider already exists .', 'conflict');
            }

            const buffer = fs.readFileSync(file.path);
                        const folder = "maaleek/uploads";
            
                        await this.r2Service.uploadFile(
                            file.filename,
                            buffer,
                            file.mimetype,
                            folder
                        );

            const provider : ProviderModel = { id : uuidv4(), libelle : context.libelle, activated : false, cover : `${folder}/${file.filename}`, description : context.description};

            const saved = await this.providerRepo.save(provider);

            return ApiResponseUtil.ok(ProviderDtm.fromProviderDtm(saved),'', 'Provider created 🎉 .');

        }catch(e){
            return ApiResponseUtil.error('',"Failed to create provider .", "internal_error");
        }
    }

    async listing() : Promise<ApiResponse<ProviderDtm[]>> {
        const providers = await this.providerRepo.getAll();
        return ApiResponseUtil.ok(providers.map(ProviderDtm.fromProviderDtm), '', 'List of payment providers retrieved 🎉 .');
    }

    async toogleProviderStatus(provider_id : string) : Promise<ApiResponse<ProviderDtm>> {
        try{
            const provider = await this.providerRepo.findById(provider_id);
            if(provider == null)
            {
                return ApiResponseUtil.error('Provider not found','This provider does not exist. Please try again with a different provider .', 'not_found');
            }

            provider.activated = !provider.activated;

            await this.providerRepo.save(provider);

            return ApiResponseUtil.ok(ProviderDtm.fromProviderDtm(provider), provider.activated ? 'Provider activated' : 'Provider deactivated', 'This provider was ' + (provider.activated ? 'activated' : 'deactivated') + ' successfully .');
        }catch(e){
            return ApiResponseUtil.error('Internal error','An unexpected error occurred, please try again .', 'internal_error');
        }
    }



}