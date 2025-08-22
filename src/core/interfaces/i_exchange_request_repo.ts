import { ExchangeRequestModel } from "../domain/models/exchange_request.model";

export interface IExchangeRequestRepo {
    findBySender(sender_id : string) : Promise<ExchangeRequestModel[]>;
    findByRecipient(recipient_id : string) : Promise<ExchangeRequestModel[]>;
    save(exchangeRequest : ExchangeRequestModel) : Promise<ExchangeRequestModel>;
}