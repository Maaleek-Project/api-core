import { ExchangeRequestStatus } from "@prisma/client";
import { AccountModel } from "./account.model";

export class ExchangeRequestModel {
    id : string;
    sender : AccountModel;
    recipient : AccountModel;
    status? : ExchangeRequestStatus;
    created_at? : Date;
    updated_at? : Date;
}