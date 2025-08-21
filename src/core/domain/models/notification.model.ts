import { NotificationType } from "@prisma/client";
import { AccountModel } from "./account.model";

export interface NotificationModel {
    id: string;
    account: AccountModel;
    title: string;
    message: string;
    type : NotificationType;
    readed?: boolean;
    deleted?: boolean;
    created_at?: Date;
    updated_at?: Date;
}