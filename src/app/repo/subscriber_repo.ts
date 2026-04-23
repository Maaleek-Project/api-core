import { Injectable } from "@nestjs/common";
import { SubscriberModel } from "src/core/domain/models/subscriber.model";
import { ISubscriberRepo } from "src/core/interfaces/i_subscriber_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class SubscriberRepo implements ISubscriberRepo {

     constructor(
            private readonly prisma: PrismaService,
    ) {}
    

    async findByCompany(company_id : string) : Promise<any[]> {
        return [];
    }

    async findByUserId(user_id : string, company_id : string) : Promise<any> {
        const subscriber = await this.prisma.companySubscriber.findFirst({
            where : {
                company_id : company_id,
                user_id : user_id
            },
            include : {
                company : true,
                user : true
            }
        });
        return subscriber ? this.toSubscriber(subscriber) : null;
    }

    async save(subscriber : any) : Promise<any> {
        const client = await this.prisma;
        const saved = await client.companySubscriber.upsert({
            where : {
                id : subscriber.id
            },
            update : this.toDatabase(subscriber),
            create : this.toDatabase(subscriber),
            include : {
                company : true,
                user : true
            }
        });
        return this.toSubscriber(saved);
    }

    private toDatabase(subscriber : SubscriberModel) : any {
        return {
            id : subscriber.id,
            company_id : subscriber.company.id,
            user_id : subscriber.user.id,
            is_subscribed : subscriber.is_subscribed
        }
    }

    private toSubscriber(subscriber : any) : SubscriberModel {
        return {
            id : subscriber.id,
            company : subscriber.company,
            user : subscriber.user,
            is_subscribed : subscriber.is_subscribed
        }
    }
}