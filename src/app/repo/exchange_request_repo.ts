import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { ExchangeRequestModel } from "src/core/domain/models/exchange_request.model";
import { IExchangeRequestRepo } from "src/core/interfaces/i_exchange_request_repo";
import { PrismaService } from "src/prisma.service";

const EXCHANGE_INCLUDE = {
    sender: {
        include: {
            user: {
                include: {
                    businessCard: {
                        include: { offer: true }
                    }
                }
            }
        }
    },
    recipient: true
} as const;

@Injectable()
export class ExchangeRequestRepo implements IExchangeRequestRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async findById(id: string): Promise<ExchangeRequestModel> {
        const exchangeRequest = await this.prisma.exchangeRequest.findUnique({
            where: { id },
            include: EXCHANGE_INCLUDE
        });
        return this.toExchangeRequest(exchangeRequest);
    }

    async findBySender(sender_id: string): Promise<ExchangeRequestModel[]> {
        const exchangeRequests = await this.prisma.exchangeRequest.findMany({
            where: { sender_id },
            include: EXCHANGE_INCLUDE
        });
        return exchangeRequests.map(er => this.toExchangeRequest(er));
    }

    async findByRecipient(recipient_id: string): Promise<ExchangeRequestModel[]> {
        const exchangeRequests = await this.prisma.exchangeRequest.findMany({
            where: { recipient_id },
            include: EXCHANGE_INCLUDE
        });
        return exchangeRequests.map(er => this.toExchangeRequest(er));
    }

    async save(exchangeRequest: ExchangeRequestModel, tx?: Prisma.TransactionClient): Promise<ExchangeRequestModel> {
        const client = tx ?? this.prisma;
        const saved = await client.exchangeRequest.upsert({
            where: { id: exchangeRequest.id },
            update: this.toDatabase(exchangeRequest),
            create: this.toDatabase(exchangeRequest),
        });
        return this.toExchangeRequest(saved);
    }

    private toDatabase(exchangeRequest: ExchangeRequestModel): any {
        return {
            id: exchangeRequest.id,
            sender_id: exchangeRequest.sender.id,
            recipient_id: exchangeRequest.recipient.id,
            status: exchangeRequest.status,
        };
    }

    private toExchangeRequest(exchangeRequest: any): ExchangeRequestModel {
        return {
            id: exchangeRequest.id,
            sender: exchangeRequest.sender,
            recipient: exchangeRequest.recipient,
            status: exchangeRequest.status,
            created_at: exchangeRequest.created_at,
            updated_at: exchangeRequest.updated_at,
        };
    }
}
