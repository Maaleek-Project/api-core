import { WorkerModel } from "../models/worker.model";

export class WorkerDtm {
    id : string ;
    civility : string ;
    worker_name : string ;
    worker_surname : string ;
    created_at : Date;

    constructor(id : string, civility : string , worker_name : string , worker_surname : string, created_at : Date){
        this.id = id ;
        this.worker_name= worker_name;
        this.worker_surname = worker_surname ;
        this.civility = civility;
        this.created_at = created_at;
    }

    static fromWorkerDtm(worker : WorkerModel) : WorkerDtm {
        return new WorkerDtm(worker.id, worker.account.user.civility, worker.account.user.name , worker.account.user.surname, worker.created_at!)
    }
}