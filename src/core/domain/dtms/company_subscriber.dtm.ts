import { CompanySusbcriberModel } from "../models/company_susbcriber.model";
import { UserDtm } from "./user.dtm";

export class CompanySubscriberDtm {
    id : string ;
    is_subscribed : boolean;
    created_at:string;
    user : UserDtm;


    constructor
    (
        id : string , 
        is_subscribed : boolean,
        created_at:string,
        user : UserDtm
    ){
        this.id = id ;
        this.is_subscribed = is_subscribed;
        this.created_at = created_at;
        this.user = user ;
    }

    static fromCompanySubscriberDtm(subscriber : CompanySusbcriberModel) : CompanySubscriberDtm {

        console.log(subscriber)

        return new CompanySubscriberDtm(subscriber.id, subscriber.is_subscribed, subscriber.created_at?? '', UserDtm.fromUserDtm(subscriber.user));
    }
}