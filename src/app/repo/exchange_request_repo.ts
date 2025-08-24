import { Injectable } from "@nestjs/common";
import { ExchangeRequestModel } from "src/core/domain/models/exchange_request.model";
import { IExchangeRequestRepo } from "src/core/interfaces/i_exchange_request_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ExchangeRequestRepo implements IExchangeRequestRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async findById(id : string) : Promise<ExchangeRequestModel> {
        const exchangeRequest = await this.prisma.exchangeRequest.findUnique({
            where : {id : id},
            include : {
                 sender : {
                    include : {
                        user : true
                    }
                },
                recipient : true
            }
        })
        return this.toExchangeRequest(exchangeRequest);
    }

    async findBySender(sender_id : string) : Promise<ExchangeRequestModel[]> {
        const exchangeRequests = await this.prisma.exchangeRequest.findMany({
            where : {sender_id : sender_id},
            include : {
                 sender : {
                    include : {
                        user : true
                    }
                },
                recipient : true
            }
        })
        return exchangeRequests.map(exchangeRequest => this.toExchangeRequest(exchangeRequest));
    }

    async findByRecipient(recipient_id : string) : Promise<ExchangeRequestModel[]> {
        const exchangeRequests = await this.prisma.exchangeRequest.findMany({
            where : {recipient_id : recipient_id},
            include : {
                sender : {
                    include : {
                        user : true
                    }
                },
                recipient : true
            }
        })
        return exchangeRequests.map(exchangeRequest => this.toExchangeRequest(exchangeRequest));
    }

    async save(exchangeRequest : ExchangeRequestModel) : Promise<ExchangeRequestModel> {
        const saved = await this.prisma.exchangeRequest.upsert({
            where: {id : exchangeRequest.id},
            update: this.toDatabase(exchangeRequest),
            create: this.toDatabase(exchangeRequest),
        })
        return this.toExchangeRequest(saved);
    }

    private toDatabase(exchangeRequest : ExchangeRequestModel) : any {
        return {
            id : exchangeRequest.id,
            sender_id : exchangeRequest.sender.id,
            recipient_id : exchangeRequest.recipient.id,
            status : exchangeRequest.status,
        };
    }

    private toExchangeRequest(exchangeRequest : any) : ExchangeRequestModel {
        return {
            id : exchangeRequest.id,
            sender : exchangeRequest.sender,
            recipient : exchangeRequest.recipient,
            status : exchangeRequest.status,
            created_at : exchangeRequest.created_at,
            updated_at : exchangeRequest.updated_at,
        };
    }
}