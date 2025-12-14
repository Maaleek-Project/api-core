import { Injectable } from "@nestjs/common";
import { UpdateCompanyConfigContext } from "src/app/context/company.context";
import { CompanyRepo } from "src/app/repo/company_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { CompanyInfoDtm } from "src/core/domain/dtms/company_info.dtm";
import { CompanyModel } from "src/core/domain/models/company.model";

@Injectable()
export class SettingFeature {


    constructor(
        private readonly companyRepo : CompanyRepo,
    ){}


    async companyInfo(accountDtm : AccountDtm) : Promise<ApiResponse<CompanyInfoDtm>> {
        const company : CompanyModel | null = await this.companyRepo.findByAccount(accountDtm.id);

        if(company == null)
        {
            return ApiResponseUtil.error('','Company not found .', 'not_found');
        }

        return ApiResponseUtil.ok(CompanyInfoDtm.fromCompanyInfoDtm(company),'','Company informations 🎉 .');
    }


    async updateCompanyConfig(accountDtm : AccountDtm, context : UpdateCompanyConfigContext) : Promise<ApiResponse<CompanyInfoDtm>> {


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
            company.name = context.company_name;
            company.number = context.company_number;
            company.address = context.company_address;

            await this.companyRepo.save(company);


            return ApiResponseUtil.ok(CompanyInfoDtm.fromCompanyInfoDtm(company),'','Company informations 🎉 .');


        }catch(e){
            console.log(e)
            return ApiResponseUtil.error('Erreur interne','Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }

    }

}