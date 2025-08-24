import { BusinessCardModel } from "../domain/models/business_card.model";

export interface IBusinessCardRepo {
    haveTheBusinessCardsReceived(senders_id : string[]) : Promise<BusinessCardModel[]>;
}