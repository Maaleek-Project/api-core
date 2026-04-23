import { SubscriberModel } from "../domain/models/subscriber.model";

export interface ISubscriberRepo {
    findByCompany(company_id : string) : Promise<SubscriberModel[]>;
    save(subscriber : SubscriberModel) : Promise<SubscriberModel>;
    findByUserId(user_id : string, company_id : string) : Promise<SubscriberModel | null>;
}