import { Injectable } from "@nestjs/common";
import { WorkerModel } from "src/core/domain/models/worker.model";
import { IWorkerRepo } from "src/core/interfaces/i_worker_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class WorkerRepo implements IWorkerRepo {

    constructor(
            private readonly prisma: PrismaService,
        ) { }
    
    async findWorkerByCompany(company_id : string) : Promise<WorkerModel[]> {
        const workers = await this.prisma.worker.findMany({
            where: {company_id : company_id
            },
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
        return workers.map(worker => this.toWorkerModel(worker));
    }

    async findWorker(account_id : string) : Promise<WorkerModel | null> {
        const worker = await this.prisma.worker.findFirst({
            where: {account_id : account_id,
                state : 'in_office'
            },
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
        return worker ? this.toWorkerModel(worker) : null;
    }
    

    async save (worker : WorkerModel) : Promise<WorkerModel> {
        const saved = await this.prisma.worker.upsert({
            where: {id : worker.id},
            update: this.toDatabase(worker),
            create: this.toDatabase(worker),
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
        return this.toWorkerModel(saved);
    }

    async findAllWorkers() : Promise<WorkerModel[]> {
        const workers = await this.prisma.worker.findMany({
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
        return workers.map(worker => this.toWorkerModel(worker));
    }

    async findByCompany(company_id : string) : Promise<WorkerModel[]> {
        const workers = await this.prisma.worker.findMany({
            where: {company_id : company_id},
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
        return workers.map(worker => this.toWorkerModel(worker));
    }

    private toWorkerModel(worker : any) : WorkerModel {
        return {
            id: worker.id,
            account : worker.account,
            company : worker.company,
            state: worker.state,
            created_at: worker.created_at,
            updated_at: worker.updated_at,
        }
    }

    private toDatabase(worker : WorkerModel) : any {
        return {
            id: worker.id,
            account_id: worker.account.id,
            company_id: worker.company.id,
            state: worker.state,
        }
    }
}