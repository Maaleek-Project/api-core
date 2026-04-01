import { Injectable } from "@nestjs/common";
import { CompanyRepo } from "src/app/repo/company_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { R2Service } from "src/core/services/r2.service";
import { CreateAdvertisingContext } from "src/app/context/advertising.context";
import * as fs from 'fs';
import { validateVideoDuration } from "src/validators/file.validator";
import { v4 as uuidv4 } from 'uuid';
import { AdvertisingRepo } from "src/app/repo/advertising_repo";
import { AdvertisingModel } from "src/core/domain/models/advertising.model";
import { AdvertisingType } from "@prisma/client";
import { AdvertisingDtm } from "src/core/domain/dtms/adversiting.dtm";

@Injectable()
export class AdvertisingFeature {

    constructor(
        private readonly companyRepo: CompanyRepo,
        private readonly r2Service: R2Service,
        private readonly advertisingRepo: AdvertisingRepo,
    ) {}

    async createAdvertising(accountDtm: AccountDtm, context: CreateAdvertisingContext, file?: Express.Multer.File): Promise<ApiResponse<AdvertisingDtm>> {
        try {
            const company = await this.companyRepo.findByAccount(accountDtm.id);

            if (company == null) {
                return ApiResponseUtil.error('', 'Company not found .', 'not_found');
            }

            const type = context.type.toUpperCase() as AdvertisingType;
            let link: string | undefined = undefined;

            if (type === AdvertisingType.TEXT) {
                // Pas de fichier requis — juste le lien optionnel
                link = context.link ?? undefined;

            } else {
                // Fichier obligatoire pour IMAGE et VIDEO
                if (!file) {
                    return ApiResponseUtil.error('Fichier requis', `Un fichier média est obligatoire pour le type ${context.type} .`, 'bad_request');
                }

                const isImage = file.mimetype.startsWith('image/');
                const isVideo = file.mimetype.startsWith('video/');

                if (type === AdvertisingType.IMAGE && !isImage) {
                    fs.unlinkSync(file.path);
                    return ApiResponseUtil.error('', 'Le fichier doit être une image .', 'bad_request');
                }

                if (type === AdvertisingType.VIDEO && !isVideo) {
                    fs.unlinkSync(file.path);
                    return ApiResponseUtil.error('', 'Le fichier doit être une vidéo .', 'bad_request');
                }

                if (type === AdvertisingType.VIDEO) {
                    let isValidDuration: boolean;
                    try {
                        isValidDuration = await validateVideoDuration(file.path, 10);
                    } catch {
                        fs.unlinkSync(file.path);
                        return ApiResponseUtil.error('', 'Impossible de valider la durée de la vidéo .', 'internal_error');
                    }

                    if (!isValidDuration) {
                        fs.unlinkSync(file.path);
                        return ApiResponseUtil.error('', 'La durée de la vidéo ne doit pas dépasser 10 secondes .', 'bad_request');
                    }
                }

                const folder = type === AdvertisingType.IMAGE
                    ? 'maaleek/advertisings/images'
                    : 'maaleek/advertisings/videos';

                const buffer = fs.readFileSync(file.path);
                link = await this.r2Service.uploadFile(file.filename, buffer, file.mimetype, folder);
                fs.unlinkSync(file.path);
            }

            const advertisingModel: AdvertisingModel = {
                id: uuidv4(),
                company,
                type,
                title: context.title,
                description: context.description,
                link,
            };

            const advertising = await this.advertisingRepo.save(advertisingModel);
            return ApiResponseUtil.ok(AdvertisingDtm.fromAdvertisingDtm(advertising), '', 'Publicité créée avec succès 🎉 .');

        } catch (e) {
            console.log(e);
            if (file && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            return ApiResponseUtil.error('Erreur interne', 'Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }

    async listingAdvertisings(accountDtm: AccountDtm): Promise<ApiResponse<AdvertisingDtm[]>> {
        try {
            const company = await this.companyRepo.findByAccount(accountDtm.id);

            if (company == null) {
                return ApiResponseUtil.error('', 'Company not found .', 'not_found');
            }

            const advertisings = await this.advertisingRepo.findByCompanyId(company.id);
            return ApiResponseUtil.ok(advertisings.map(AdvertisingDtm.fromAdvertisingDtm), '', 'Liste des publicités récupérée 🎉 .');
        } catch (e) {
            console.log(e);
            return ApiResponseUtil.error('Erreur interne', 'Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }

    async toogleAdvertising(id : string) : Promise<ApiResponse<AdvertisingDtm>>  {
        try {
            const advertising = await this.advertisingRepo.findById(id);
            if(!advertising){
                return ApiResponseUtil.error('', 'Advertising not found .', 'not_found');
            }
            advertising.is_active = !advertising.is_active;
            await this.advertisingRepo.save(advertising);
            return ApiResponseUtil.ok(AdvertisingDtm.fromAdvertisingDtm(advertising), '', 'Advertising updated .');
        } catch (e) {
            console.log(e);
            return ApiResponseUtil.error('Erreur interne', 'Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }

    async deleteAdvertising(id : string) : Promise<ApiResponse<AdvertisingDtm>>  {
        try {
            const advertising = await this.advertisingRepo.findById(id);
            if(!advertising){
                return ApiResponseUtil.error('', 'Advertising not found .', 'not_found');
            }
            advertising.is_deleted = true;
            advertising.is_active = false;
            await this.advertisingRepo.save(advertising);
            return ApiResponseUtil.ok(AdvertisingDtm.fromAdvertisingDtm(advertising), '', 'Advertising deleted .');
        } catch (e) {
            console.log(e);
            return ApiResponseUtil.error('Erreur interne', 'Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }
}
