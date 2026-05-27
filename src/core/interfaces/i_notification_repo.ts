import { NotificationModel } from "../domain/models/notification.model"

export interface INotificationRepo {
    save(notification : NotificationModel) : Promise<NotificationModel>
    saveMany(notifications : NotificationModel[]) : Promise<void>
    findByAccount(account_id : string) : Promise<NotificationModel[]>
    findById(id : string, account_id : string) : Promise<NotificationModel | null>
    remove(notification : NotificationModel) : Promise<void>
    readed(notification : NotificationModel) : Promise<void>
}