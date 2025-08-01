import { WorkerModel } from "../domain/models/worker.model";

export interface IWorkerRepo {
    findAllWorkers() : Promise<WorkerModel[]>;
    findByCompany(company_id : string) : Promise<WorkerModel[]>;
    save(account : WorkerModel) : Promise<WorkerModel>;
    findWorker(account_id : string) : Promise<WorkerModel | null>;
    findWorkerByCompany(company_id : string) : Promise<WorkerModel[]>;
}