import { Injectable } from "@nestjs/common";
import { ExchangeRequestContext } from "src/app/context/main.context";
import { AccountRepo } from "src/app/repo/account_repo";
import { ExchangeRequestRepo } from "src/app/repo/exchange_request_repo";
import { NotificationRepo } from "src/app/repo/notification_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { NotificationDtm } from "src/core/domain/dtms/notification.dtm";
import { AccountModel } from "src/core/domain/models/account.model";
import { ExchangeRequestModel } from "src/core/domain/models/exchange_request.model";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MainFeature {

    constructor(
        private readonly notificationRepo : NotificationRepo,
        private readonly accountRepo : AccountRepo,
        private readonly exchangeRequestRepo : ExchangeRequestRepo,
    ) {}

    async userNotifications(accounnt : AccountDtm) : Promise<ApiResponse<NotificationDtm[]>> {
        const notifications = await this.notificationRepo.findByAccount(accounnt.id);
        return ApiResponseUtil.ok(notifications.map(NotificationDtm.fromNotificationDtm),'','Notifications listed 🎉 .');
    }

    async exchangeRequest(context : ExchangeRequestContext) : Promise<ApiResponse<AccountDtm>> {
        try{
            const sender : AccountModel | null = await this.accountRepo.findById(context.request_sender_id)
            const recipient : AccountModel | null = await this.accountRepo.findById(context.request_recipient_id)

            if(sender == null || recipient == null)
            {
                return ApiResponseUtil.error('Session inactive','Désolé, votre session a expiré, merci de bien vouloir vous reconnecter et réessayer .', 'unauthorized')
            }

            const exchange : ExchangeRequestModel = {
                id : uuidv4(),
                sender : sender,
                recipient : recipient
            }

            await this.exchangeRequestRepo.save(exchange);

            return ApiResponseUtil.ok(AccountDtm.fromAccountDtm(sender),'Demande d\'échange envoyée', 'Votre demande d\'échange a bien été envoyée, vous serez notifié dès que votre demande sera acceptée .');
        }catch(e){
            return ApiResponseUtil.error('Erreur interne','Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }
}