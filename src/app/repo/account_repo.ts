import { Injectable } from "@nestjs/common";
import { AccountModel } from "src/core/domain/models/account.model";
import { IAccountRepo } from "src/core/interfaces/i_account_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AccountRepo implements IAccountRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async findById(id: string): Promise<AccountModel | null> {
        const account = await this.prisma.account.findFirst({
            where : {id : id},
            include: {
                user: {
                    include: {
                        businessCard : {
                            include: {
                                offer : true
                            }
                        }
                    }
                },
                country: true,
                entity: true
            }
        })

        return account ? this.toAccount(account) : null ;
    }

    async save(model : AccountModel) : Promise<AccountModel> {
        const account = await this.prisma.account.upsert({
            where: {id : model.id},
            update: this.toDatabase(model),
            create: this.toDatabase(model),
            include: {
                user: {
                    include: {
                        businessCard : {
                            include: {
                                offer : true
                            }
                        }
                    }
                },
                country: true,
                entity: true
            }
        })

        return this.toAccount(account);
    }

    async fetchByLogin(login: string, country_id: string): Promise<AccountModel | null> {
        const account = await this.prisma.account.findFirst({
            where: {login , country_id},
            include: {
                user: {
                    include: {
                        businessCard : {
                            include: {
                                offer : true
                            }
                        }
                    }
                },
                country: true,
                entity: true
            }
        })
        
        return account ? this.toAccount(account) : null;
    }

    async findAllCustomer() : Promise<AccountModel[]> {
        const accounts = await this.prisma.account.findMany({
            where: {
                entity : {
                    code : 'Customer'
                }
            },
            include: {
                user: {
                    include: {
                        businessCard : {
                            include: {
                                offer : true
                            }
                        }
                    }
                },
                country: true,
                entity: true
            }
        })

        return accounts.map(account => this.toAccount(account));
    }


    private toAccount(account : any) : AccountModel {
        return {
            id: account.id,
            login: account.login,
            password: account.password,
            fcm_token : account.fcm_token,
            user: account.user,
            country: account.country,
            entity: account.entity,
            status: account.status,
            state: account.state,
            locked: account.locked,
            created_at: account.created_at,
            updated_at: account.updated_at,
        }
    }

    private toDatabase(account : AccountModel) : any {
        return {
            id: account.id,
            login: account.login,
            password: account.password,
            user_id: account.user.id,
            country_id : account.country.id,
            entity_id : account.entity.id,
            status: account.status,
            fcm_token : account.fcm_token,
            document_id : account.document_id
        }
    }

}