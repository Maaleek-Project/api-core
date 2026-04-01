import { Injectable } from "@nestjs/common";
import { UpdateCompanyBusinessCardContext } from "src/app/context/company.context";
import { CompanyRepo } from "src/app/repo/company_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { CompanyInfoDtm } from "src/core/domain/dtms/company_info.dtm";
import { CompanyModel } from "src/core/domain/models/company.model";
import { R2Service } from "src/core/services/r2.service";
import * as fs from 'fs';

@Injectable()
export class SettingFeature {


    constructor(
        private readonly companyRepo : CompanyRepo,
        private readonly r2Service: R2Service,
    ){}


    async companyInfo(accountDtm : AccountDtm) : Promise<ApiResponse<CompanyInfoDtm>> {
        const company : CompanyModel | null = await this.companyRepo.findByAccount(accountDtm.id);

        if(company == null)
        {
            return ApiResponseUtil.error('','Company not found .', 'not_found');
        }

        return ApiResponseUtil.ok(CompanyInfoDtm.fromCompanyInfoDtm(company),'','Company informations 🎉 .');
    }


    async updateCompanyLogo(accountDtm : AccountDtm, file: Express.Multer.File) : Promise<ApiResponse<string>> {
        try{

            const company : CompanyModel | null = await this.companyRepo.findByAccount(accountDtm.id);
            if(company == null)
            {
                return ApiResponseUtil.error('','Company not found .', 'not_found');
            }

            const buffer = fs.readFileSync(file.path);
            const folder = "maaleek/companies/logos";

            const link = await this.r2Service.uploadFile(
                file.filename,
                buffer,
                file.mimetype,
                folder
            );

            if (company.logo &&  company.logo.trim() !== "" &&  company.logo !== `${folder}/${file.filename}`) {
                await this.r2Service.deleteFile(company.logo);
            }

            company.logo = `${folder}/${file.filename}`;
            await this.companyRepo.save(company);

            return ApiResponseUtil.ok('','Logo mis à jour 🎉 .','Votre logo a été mis à jour .');


        }catch(e){
            console.log(e)
            return ApiResponseUtil.error('Erreur interne','Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }


    async updateCompanyConfig(accountDtm : AccountDtm, context : UpdateCompanyBusinessCardContext) : Promise<ApiResponse<CompanyInfoDtm>> {
        try {
            const company : CompanyModel | null = await this.companyRepo.findByAccount(accountDtm.id);
            if(company == null)
            {
                return ApiResponseUtil.error('','Company not found .', 'not_found');
            }

            company.front_text_color = context.front_text_color;
            company.back_text_color = context.back_text_color;
            company.front_background_color = context.front_background_color;
            company.back_background_color = context.back_background_color;
            company.slogan = context.slogan;

            await this.companyRepo.save(company);

            return ApiResponseUtil.ok(CompanyInfoDtm.fromCompanyInfoDtm(company),'','Company informations 🎉 .');


        }catch(e){
            console.log(e)
            return ApiResponseUtil.error('Erreur interne','Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }

    }

}