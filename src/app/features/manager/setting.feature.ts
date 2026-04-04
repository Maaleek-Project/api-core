import { Injectable } from "@nestjs/common";
import { UpdateCompanyAuthPasswordContext, UpdateCompanyBasicInfoContext, UpdateCompanyBusinessCardContext, UpdateManagerInfoContext } from "src/app/context/company.context";
import { CompanyRepo } from "src/app/repo/company_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { CompanyInfoDtm } from "src/core/domain/dtms/company_info.dtm";
import { CompanyModel } from "src/core/domain/models/company.model";
import { R2Service } from "src/core/services/r2.service";
import * as fs from 'fs';
import { AccountRepo } from "src/app/repo/account_repo";
import { UserRepo } from "src/app/repo/user_repo";
import { UserModel } from "src/core/domain/models/user.model";
import { AuthentificationService } from "src/core/services/authenfication.service";

@Injectable()
export class SettingFeature {


    constructor(
        private readonly companyRepo : CompanyRepo,
        private readonly r2Service: R2Service,
        private readonly userRepo : UserRepo,
        private readonly authentificationService: AuthentificationService,
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

    async updateManagerInfo(accountDtm : AccountDtm, context : UpdateManagerInfoContext) : Promise<ApiResponse<CompanyInfoDtm>> {
        try{

            let company : CompanyModel | null = await this.companyRepo.findByAccount(accountDtm.id);
            if(company == null)
            {
                return ApiResponseUtil.error('','Company not found .', 'not_found');
            }

            const user : UserModel | null = await this.userRepo.findById(accountDtm.user.id);

            if(user && user.id !== company.account.user.id)
            {
                return ApiResponseUtil.error('','Manager email is already in use .', 'conflict');
            }


            if(user != null)
            {
                user.name = context.manager_name;
                user.surname = context.manager_surname;
                user.email = context.manager_email;
                user.civility = context.manager_civility ;
                await this.userRepo.save(user);
            }

            company = await this.companyRepo.findByAccount(accountDtm.id) as CompanyModel;

            return ApiResponseUtil.ok(CompanyInfoDtm.fromCompanyInfoDtm(company),'','Informations mises à jour 🎉 .');

        }catch(e){
            console.log(e)
            return ApiResponseUtil.error('Erreur interne','Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }

    async updateCompanyBasicInfo(accountDtm : AccountDtm, context : UpdateCompanyBasicInfoContext) : Promise<ApiResponse<CompanyInfoDtm>> {
        try{
            const company : CompanyModel | null = await this.companyRepo.findByAccount(accountDtm.id);
            if(company == null)
            {
                return ApiResponseUtil.error('','Company not found .', 'not_found');
            }

            company.name = context.company_name;
            company.address = context.company_address;

            await this.companyRepo.save(company);

            return ApiResponseUtil.ok(CompanyInfoDtm.fromCompanyInfoDtm(company),'','Informations mises à jour 🎉 .');

        }catch(e){
            console.log(e)
            return ApiResponseUtil.error('Erreur interne','Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }

    async updateCompanyAuthPassword(accountDtm : AccountDtm, context : UpdateCompanyAuthPasswordContext) : Promise<ApiResponse<string>> {
        try{
            const company : CompanyModel | null = await this.companyRepo.findByAccount(accountDtm.id);
            if(company == null)
            {
                return ApiResponseUtil.error('','Company not found .', 'not_found');
            }


            console.log("context.current_password")
            console.log(context.current_password)
            console.log((await this.authentificationService.hashPassword(context.current_password)))

            const isValid = await this.authentificationService.comparePassword(context.current_password, company.password);


            if(!isValid)
            {
                return ApiResponseUtil.error('','Current password is not valid .', 'conflict');
            }

            company.password = await this.authentificationService.hashPassword(context.new_password);

            await this.companyRepo.save(company);

            return ApiResponseUtil.ok('','Password mis à jour 🎉 .','Votre mot de passe a été mis à jour .');

        }catch(e){
            console.log(e)
            return ApiResponseUtil.error('Erreur interne','Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }
}