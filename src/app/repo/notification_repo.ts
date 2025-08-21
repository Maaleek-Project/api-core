import { Injectable } from "@nestjs/common";
import { NotificationModel } from "src/core/domain/models/notification.model";
import { INotificationRepo } from "src/core/interfaces/i_notification_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class NotificationRepo implements INotificationRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async findById(id : string) : Promise<NotificationModel | null> {
        const notification = await this.prisma.notification.findUnique({
            where : {id : id},
            include : {
                account : false
            }
        })
        return notification ? this.toNotification(notification) : null;
    }

    async save(notification : NotificationModel) : Promise<NotificationModel> {
        const saved = await this.prisma.notification.upsert({
            where: {id : notification.id},
            update: this.toDatabase(notification),
            create: this.toDatabase(notification),
        })
        return this.toNotification(saved);
    }

    async findByAccount(account_id : string) : Promise<NotificationModel[]> {
        const notifications = await this.prisma.notification.findMany({
            where : {account_id : account_id},
            include : {
                account : false
            }
        })
        return notifications.map(notification => this.toNotification(notification));
    }

    private toDatabase(notification : NotificationModel ) : any {
        return {
            id : notification.id,
            type : notification.type,
            account_id : notification.account.id,
            title : notification.title,
            message : notification.message
        }
    }

    private toNotification(notification : any) : NotificationModel {
        return {
            id : notification.id,
            account : notification.account,
            title : notification.title,
            type : notification.type,
            message : notification.message,
            readed : notification.readed,
            deleted : notification.deleted,
            created_at : notification.created_at,
            updated_at : notification.updated_at
        }
    }
}