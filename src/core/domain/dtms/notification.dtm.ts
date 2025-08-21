export class NotificationDtm {
    id: string;
    title: string;
    message: string;
    type: string;
    readed: boolean;
    deleted: boolean;
    created_at: Date;

    constructor(id: string,title: string, message: string, type: string, readed: boolean, deleted: boolean, created_at: Date) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.type = type;
        this.readed = readed;
        this.deleted = deleted;
        this.created_at = created_at;
    }

    static fromNotificationDtm(notification: any): NotificationDtm {
        return new NotificationDtm(notification.id, notification.title, notification.message, notification.type, notification.readed, notification.deleted, notification.created_at);
    }
}