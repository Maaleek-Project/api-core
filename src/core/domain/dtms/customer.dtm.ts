import { AccountDtm } from "./account.dtm";

export class CustomerDtm {
    id : string;
    civility : string;
    name : string;
    surname : string;
    number : string;
    email :string;
    subscription : {
        libelle : string ,
        color : string,
        expired_at : string
    };
    membership : {
        company_name : string , 
        job_name : string
     } | null ;
    remaining_point : number;
    is_locked : boolean ;
    histories : {
        id : string ;
        status : string;
        created_at : string;
        movement : string;
        person : {
            username : string ;
            number : string;
            company_name : string ;
        }
    }[];

    constructor(id : string, civility : string, name : string, surname : string, number : string,
        email :string,
        subscription : {
        libelle : string ,
        color : string,
        expired_at : string
    },
    membership : {
        company_name : string , 
        job_name : string
    } | null ,
    remaining_point : number ,
    is_locked : boolean = false,
    histories : {
        id : string ,
        status : string,
        created_at : string,
        movement : string,
        person : {
            username : string ,
            number : string,
            company_name : string ,
        }
    }[]
    ) {
        this.id = id;
        this.civility = civility;
        this.name = name;
        this.surname = surname;
        this.number = number;
        this.subscription = subscription;
        this.membership = membership;
        this.remaining_point = remaining_point;
        this.email = email;
        this.is_locked = is_locked;
        this.histories = histories;
    }

    static fromCustomerDtm(customer: AccountDtm): CustomerDtm {
        

        return new CustomerDtm(
            customer.id, 
            customer.user.civility, 
            customer.user.name, 
            customer.user.surname, 
            `+${customer.country.code} ${customer.user.number}`,
            customer.user.email!,
            {
                libelle : customer.user.card.offer.libelle,
                color : customer.user.card.offer.badge_color,
                expired_at : new Date(new Date().getTime() + customer.user.card.offer.periodicity * 24 * 60 * 60 * 1000).toISOString()
            },
            customer.worker ? {
                company_name : customer.worker.company_name,
                job_name : customer.worker.job_name
            } : null,
            15,
            customer.locked || false,
            customer.sender ? customer.sender.map((exchangeRequest : any) => {

                const mvt = exchangeRequest.sender_id === customer.id ? 'outgoing' : 'incoming';

                const person = exchangeRequest.sender_id === customer.id
                    ? exchangeRequest.recipient
                    : exchangeRequest.sender;

                return {
                    id : exchangeRequest.id,
                    status : exchangeRequest.status,
                    created_at : exchangeRequest.created_at,
                    movement : mvt,
                    person : {
                        username : `${person.user.name} ${person.user.surname}`,
                        number : `+${person.country.code} ${person.user.number}`,
                        company_name : person.worker && person.worker.length > 0 ? person.worker[0].company.name : ''
                    }
                }
            }) : []
        );
    }
}