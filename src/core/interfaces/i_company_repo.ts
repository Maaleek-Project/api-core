import { CompanyModel } from "../domain/models/company.model";

export interface ICompanyRepo {
    save(company : CompanyModel) : Promise<CompanyModel>
    findCompany(id : string) : Promise<CompanyModel | null>
    findByNumerOrEmail(number : string, email : string) : Promise<CompanyModel | null>
    findAllCompanies() : Promise<CompanyModel[]>
    findByAccount(account_id : string) : Promise<CompanyModel | null>
}