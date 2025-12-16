import { Injectable } from "@nestjs/common";
import { CompanyModel } from "src/core/domain/models/company.model";
import { ICompanyRepo } from "src/core/interfaces/i_company_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class CompanyRepo implements ICompanyRepo {

    constructor(
            private readonly prisma: PrismaService,
        ) {}
    
    async findByAccount(account_id : string) : Promise<CompanyModel | null> {
        const company = await this.prisma.company.findFirst({
            where : {account_id : account_id},
            include : {
                account : {
                    include : {
                        user : {
                            include : {
                                businessCard : {
                                    include : {
                                        offer : true
                                    }
                                }
                            }
                        },
                        country : true,
                        entity : true
                    }
                }
            }
        });
        return company ? this.toCompany(company) : null;
    }
    
    async findCompany(id : string) : Promise<CompanyModel | null> {
        const company = await this.prisma.company.findUnique({
            where : {id : id},
            include : {
                account : {
                    include : {
                        user : {
                            include : {
                                businessCard : {
                                    include : {
                                        offer : true
                                    }
                                }
                            }
                        },
                        country : true,
                        entity : true
                    }
                }
            }
        });
        return company ? this.toCompany(company) : null;
    }
    
    async findAllCompanies(): Promise<CompanyModel[]> {
        const companies = await this.prisma.company.findMany({
            include : {
                account : {
                    include : {
                        user : {
                            include : {
                                businessCard : {
                                    include : {
                                        offer : true
                                    }
                                }
                            }
                        },
                        country : true,
                        entity : true
                    }
                }
            }
        })

        return companies.map(company => this.toCompany(company));
    }
        
    async save(company: CompanyModel): Promise<CompanyModel> {
        const saved = await this.prisma.company.upsert({
            where: {id : company.id},
            update: this.toDatabase(company),
            create: this.toDatabase(company),
            include : {
                 account : {
                    include : {
                        user : {
                            include : {
                                businessCard : {
                                    include : {
                                        offer : true
                                    }
                                }
                            }
                        },
                        country : true,
                        entity : true
                    }
                }
            }
        })
        return this.toCompany(saved);
    }

    async findByNumerOrEmail(number: string, email: string): Promise<CompanyModel | null> {
        const company = await this.prisma.company.findFirst({
            where: {number , email},
            include : {
                account : {
                    include : {
                        user : {
                            include : {
                                businessCard : {
                                    include : {
                                        offer : true
                                    }
                                }
                            }
                        },
                        country : true,
                        entity : true
                    }
                }

            }
        })
        return company ? this.toCompany(company) : null;
    }


    private toDatabase(company : CompanyModel ) : any {
        return {
            id : company.id,
            name : company.name,
            number : company.number,
            email : company.email,
            account_id : company.account.id,
            address : company.address,
            front_text_color : company.front_text_color,
            back_text_color : company.back_text_color,
            front_background_color : company.front_background_color,
            back_background_color : company.back_background_color,
            slogan : company.slogan,
            logo : company.logo
        }
    }

    private toCompany(company : any) : CompanyModel {

        return {
            id : company.id,
            name : company.name,
            number : company.number,
            email : company.email,
            account : company.account,
            address : company.address,
            created_at : company.created_at,
            front_text_color : company.front_text_color,
            back_text_color : company.back_text_color,
            front_background_color : company.front_background_color,
            back_background_color : company.back_background_color,
            slogan : company.slogan,
            logo : company.logo
        }
    }
}