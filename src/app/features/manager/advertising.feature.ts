import { Injectable } from "@nestjs/common";
import { CompanyRepo } from "src/app/repo/company_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { CompanyModel } from "src/core/domain/models/company.model";
import { R2Service } from "src/core/services/r2.service";
import { CreateAdvertisingContext } from "src/app/context/advertising.context";
import * as fs from 'fs';
import { validateVideoDuration } from "src/validators/file.validator";
import { v4 as uuidv4 } from 'uuid';
import { AdvertisingRepo } from "src/app/repo/advertising_repo";
import { AdvertisingModel } from "src/core/domain/models/advertising.model";

@Injectable()
export class AdvertisingFeature {

    constructor(
            private readonly companyRepo : CompanyRepo,
            private readonly r2Service: R2Service,
            private readonly advertisingRepo : AdvertisingRepo,
        ){}

    async createAdvertising(accountDtm : AccountDtm, context : CreateAdvertisingContext, file: Express.Multer.File) : Promise<ApiResponse<any>> {
        try {
            const company : CompanyModel | null = await this.companyRepo.findByAccount(accountDtm.id);
            
            if(company == null)
            {
                return ApiResponseUtil.error('','Company not found .', 'not_found');
            }

            // Valider le type
            if (context.type !== 'image' && context.type !== 'video') {
                return ApiResponseUtil.error('','Type must be "image" or "video" .', 'bad_request');
            }

            // Valider que le fichier correspond au type
            const isImage = file.mimetype.startsWith('image/');
            const isVideo = file.mimetype.startsWith('video/');

            if (context.type === 'image' && !isImage) {
                return ApiResponseUtil.error('','File must be an image .', 'bad_request');
            }

            if (context.type === 'video' && !isVideo) {
                return ApiResponseUtil.error('','File must be a video .', 'bad_request');
            }

            // Valider la durée de la vidéo (max 10 secondes)
            if (context.type === 'video') {
                try {
                    const isValidDuration = await validateVideoDuration(file.path, 10);
                    if (!isValidDuration) {
                        // Supprimer le fichier temporaire
                        fs.unlinkSync(file.path);
                        return ApiResponseUtil.error('','Video duration must not exceed 10 seconds .', 'bad_request');
                    }
                } catch (error) {
                    // Supprimer le fichier temporaire en cas d'erreur
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                    return ApiResponseUtil.error('','Failed to validate video duration .', 'internal_error');
                }
            }

            // Upload sur R2
            const buffer = fs.readFileSync(file.path);
            const folder = context.type === 'image' 
                ? "maaleek/advertisings/images" 
                : "maaleek/advertisings/videos";

            const link = await this.r2Service.uploadFile(
                file.filename,
                buffer,
                file.mimetype,
                folder
            );

            // Supprimer le fichier temporaire après upload
            fs.unlinkSync(file.path);

            // Créer l'advertising dans la base de données
            const advertisingModel : AdvertisingModel = {
                id: uuidv4(),
                company: company , // Selon le schéma Prisma, company_id référence Account
                type: context.type,
                title: context.title,
                description: context.description,
                link: link
            };

            const advertising = await this.advertisingRepo.save(advertisingModel);

            return ApiResponseUtil.ok(advertising, '', 'Advertising created successfully 🎉 .');

        } catch (e) {
            console.log(e);
            if (file && fs.existsSync(file.path)) {
                try {
                    fs.unlinkSync(file.path);
                } catch (unlinkError) {
                    console.error('Error deleting temp file:', unlinkError);
                }
            }
            return ApiResponseUtil.error('Erreur interne', 'Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }

    async listingAdvertisings(accountDtm : AccountDtm) : Promise<ApiResponse<AdvertisingModel[]>> {
        try {
            const company : CompanyModel | null = await this.companyRepo.findByAccount(accountDtm.id);
            
            if(company == null)
            {
                return ApiResponseUtil.error('','Company not found .', 'not_found');
            }

            const advertisings = await this.advertisingRepo.findByCompanyId(accountDtm.id);
            return ApiResponseUtil.ok(advertisings, '', 'Advertisings listed 🎉 .');
        } catch (e) {
            console.log(e);
            return ApiResponseUtil.error('Erreur interne', 'Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }

}