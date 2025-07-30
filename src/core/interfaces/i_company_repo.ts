import { CompanyModel } from "../domain/models/company.model";

export interface ICompanyRepo {
    save(company : CompanyModel) : Promise<CompanyModel>
    findByNumerOrEmail(number : string, email : string) : Promise<CompanyModel | null>
    findAllCompanies() : Promise<CompanyModel[]>
}