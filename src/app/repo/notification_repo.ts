import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { NotificationModel } from "src/core/domain/models/notification.model";
import { INotificationRepo } from "src/core/interfaces/i_notification_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class NotificationRepo implements INotificationRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async findById(id: string, account_id: string): Promise<NotificationModel | null> {
        const notification = await this.prisma.notification.findUnique({
            where: { id, account_id },
            include: { account: false }
        });
        return notification ? this.toNotification(notification) : null;
    }

    async remove(notification: NotificationModel): Promise<void> {
        await this.prisma.notification.update({
            where: { id: notification.id },
            data: { deleted: true , readed: true }
        });
    }

    async readed(notification: NotificationModel): Promise<void> {
        await this.prisma.notification.update({
            where: { id: notification.id },
            data: { readed: true }
        });
    }

    async saveMany(notifications: NotificationModel[]): Promise<void> {
        await this.prisma.notification.createMany({
            data: notifications.map(n => this.toDatabase(n)),
            skipDuplicates: true,
        });
    }

    async save(notification: NotificationModel, tx?: Prisma.TransactionClient): Promise<NotificationModel> {
        const client = tx ?? this.prisma;
        const saved = await client.notification.upsert({
            where: { id: notification.id },
            update: this.toDatabase(notification),
            create: this.toDatabase(notification),
        });
        return this.toNotification(saved);
    }

    async findByAccount(account_id: string): Promise<NotificationModel[]> {
        const notifications = await this.prisma.notification.findMany({
            where: { account_id, deleted: false },
            include: { account: false }
        });
        return notifications.map(n => this.toNotification(n));
    }

    private toDatabase(notification: NotificationModel): any {
        return {
            id: notification.id,
            type: notification.type,
            account_id: notification.account.id,
            title: notification.title,
            message: notification.message
        };
    }

    private toNotification(notification: any): NotificationModel {
        return {
            id: notification.id,
            account: notification.account,
            title: notification.title,
            type: notification.type,
            message: notification.message,
            readed: notification.readed,
            deleted: notification.deleted,
            created_at: notification.created_at,
            updated_at: notification.updated_at
        };
    }
}
