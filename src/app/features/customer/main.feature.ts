import { Injectable } from "@nestjs/common";
import { NotificationRepo } from "src/app/repo/notification_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { NotificationDtm } from "src/core/domain/dtms/notification.dtm";

@Injectable()
export class MainFeature {

    constructor(
        private readonly notificationRepo : NotificationRepo
    ) {}

    async userNotifications(accounnt : AccountDtm) : Promise<ApiResponse<NotificationDtm[]>> {
        const notifications = await this.notificationRepo.findByAccount(accounnt.id);
        return ApiResponseUtil.ok(notifications.map(NotificationDtm.fromNotificationDtm),'','Notifications listed 🎉 .');
    }
}