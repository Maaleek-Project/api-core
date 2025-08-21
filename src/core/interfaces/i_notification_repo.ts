import { NotificationModel } from "../domain/models/notification.model"

export interface INotificationRepo {
    save(notification : NotificationModel) : Promise<NotificationModel>
    findByAccount(account_id : string) : Promise<NotificationModel[]>
}