import { WorkerModel } from "../models/worker.model";

export class WorkerDtm {
    id : string ;
    civility : string ;
    name : string ;
    surname : string ;
    date : Date;
    number : string;
    email : string;
    status : string;
    country: string;
    job_name : string ;
    company_name : string ;

    constructor(id : string, civility : string , name : string , surname : string, 
        date : Date, number : string , email : string , status : string, country : string ,
    job_name : string, company_name : string) {
        this.id = id ;
        this.name= name;
        this.surname = surname ;
        this.civility = civility;
        this.date = date;
        this.number = number;
        this.status = status;
        this.email = email;
        this.country = country;
        this.job_name = job_name;
        this.company_name = company_name;
    }

    static fromWorkerDtm(worker : WorkerModel) : WorkerDtm {
        return new WorkerDtm(
            worker.id, 
            worker.account.user.civility, 
            worker.account.user.name , 
            worker.account.user.surname,  
            worker.updated_at!, 
            `+${worker.account.country.code} ${worker.account.user.number}`, 
            worker.account.user.email!, 
            worker.state!, 
            worker.account.country.alias,
            worker.account.user.businessCard![0].job,
            worker.company.name
        );
    }
}