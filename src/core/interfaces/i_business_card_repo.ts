import { BusinessCardModel } from "../domain/models/business_card.model";

export interface IBusinessCardRepo {
    save(businessCard : BusinessCardModel) : Promise<BusinessCardModel>;
    haveTheBusinessCardsReceived(senders_id : string[]) : Promise<BusinessCardModel[]>;
    findById(id : string) : Promise<BusinessCardModel>;
    findByEmailOrNumber(email : string, number : string) : Promise<BusinessCardModel | null>;
    findByUserId(user_id : string) : Promise<BusinessCardModel | null>;
}