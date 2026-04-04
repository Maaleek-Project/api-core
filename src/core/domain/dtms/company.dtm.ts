import { Advertising } from "@prisma/client";
import { CompanyModel } from "../models/company.model";
import { AccountDtm } from "./account.dtm";
import { CountryDtm } from "./country.dtm";
import { WorkerDtm } from "./worker.dtm";
import { AdvertisingDtm } from "./adversiting.dtm";
import { CompanySubscriberDtm } from "./company_subscriber.dtm";

export class CompanyDtm {
    id: string;
    number: string;
    email: string;
    name: string;
    address: string;
    owner : {
        username : string;
        number : string;
    };
    locked : boolean;
    pubs : number;
    workers : number;
    susbcribers : number;
    details : {
        employees : WorkerDtm[],
        advertisements : AdvertisingDtm[],
        subscribers : CompanySubscriberDtm[]
        former_employees : WorkerDtm[],
        business_subscription : {
            libelle : string ,
            expired_at : string ,
            price : number
        }
    } ;
    created_at?: Date;

    constructor(id: string, number: string, email: string, name: string, address: string, account: AccountDtm, locked : boolean , pubs : number, workers : number, susbcribers : number,
        details : {
            employees : WorkerDtm[],
            advertisements : AdvertisingDtm[],
            subscribers : CompanySubscriberDtm[]
            former_employees : WorkerDtm[],
            business_subscription : {
                libelle : string ,
                expired_at : string ,
                price : number
            }
        }, created_at?: Date
    ) {
        this.id = id;
        this.number = `+${account.country.code} ${number}`;
        this.email = email;
        this.name = name;
        this.address = address;
        this.owner = {
            username : `${account.user.name} ${account.user.surname}`,
            number : `+${account.country.code} ${account.user.number}`
        };
        this.locked = locked;
        this.created_at = created_at;
        this.pubs = pubs;
        this.workers = workers;
        this.susbcribers = susbcribers;
        this.details = details;

    }

    static fromCompanyDtm(company: CompanyModel): CompanyDtm {


        return new CompanyDtm(
            company.id, 
            company.number, 
            company.email, 
            company.name,
            company.address, 
            AccountDtm.fromAccountDtm(company.account), 
            company.locked ?? false , 
            company.advertising?.length ?? 0 , 
            company.worker?.filter(w => w.state === 'in_office').length ?? 0 ,
            company.susbcriber?.length ?? 0 , 
            {
                employees : company.worker?.filter(w => w.state === 'in_office').map(w => WorkerDtm.fromWorkerDtm(w)) ?? [],
                advertisements : company.advertising?.map(a => AdvertisingDtm.fromAdvertisingDtm(a)) ?? [],
                subscribers : company.susbcriber?.map(s => CompanySubscriberDtm.fromCompanySubscriberDtm(s)) ?? [],
                former_employees : company.worker?.filter(w => w.state === 'out_of_service').map(w => WorkerDtm.fromWorkerDtm(w)) ?? [],
                business_subscription: {
                    libelle : "Business",
                    expired_at : "15/04/2025",
                    price : 45000
                }
            },
            company.created_at
        );
    }
}