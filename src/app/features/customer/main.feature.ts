import { Injectable } from "@nestjs/common";
import { ExchangeRequestStatus, NotificationType } from "@prisma/client";
import { ExchangeRequestContext, ExchangeResponseContext, RefreshTokenContext } from "src/app/context/main.context";
import { AccountRepo } from "src/app/repo/account_repo";
import { BusinessCardRepo } from "src/app/repo/business_card_repo";
import { ExchangeRequestRepo } from "src/app/repo/exchange_request_repo";
import { NotificationRepo } from "src/app/repo/notification_repo";
import { ApiResponse, ApiResponseUtil } from "src/app/utils/api-response.util";
import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { BusinessCardDtm } from "src/core/domain/dtms/business_card.dtm";
import { NotificationDtm } from "src/core/domain/dtms/notification.dtm";
import { AccountModel } from "src/core/domain/models/account.model";
import { BusinessCardModel } from "src/core/domain/models/business_card.model";
import { ExchangeRequestModel } from "src/core/domain/models/exchange_request.model";
import { FirebaseService } from "src/core/services/firebase.service";
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from "src/prisma.service";
import { CompanyRepo } from "src/app/repo/company_repo";
import { CompanyKPIDtm } from "src/core/domain/dtms/company_kpi.dtm";
import { CompanyDtm } from "src/core/domain/dtms/company.dtm";
import { SubscriberRepo } from "src/app/repo/subscriber_repo";
import { CompanyModel } from "src/core/domain/models/company.model";

@Injectable()
export class MainFeature {

    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationRepo: NotificationRepo,
        private readonly accountRepo: AccountRepo,
        private readonly exchangeRequestRepo: ExchangeRequestRepo,
        private readonly firebaseService: FirebaseService,
        private readonly businessCardRepo: BusinessCardRepo,
        private readonly companyRepo: CompanyRepo,
        private readonly subscriberRepo: SubscriberRepo,
    ) {}

    async userNotifications(account: AccountDtm): Promise<ApiResponse<NotificationDtm[]>> {
        const notifications = await this.notificationRepo.findByAccount(account.id);
        return ApiResponseUtil.ok(notifications.map(NotificationDtm.fromNotificationDtm), '', 'Notifications listed 🎉 .');
    }

    async deleteNotification(account: AccountDtm, notificationId: string): Promise<ApiResponse<String>> {
        try {
            const notification = await this.notificationRepo.findById(notificationId, account.id);

            if (notification == null) {
                return ApiResponseUtil.error('Notification inexistante', 'Désolé, cette notification semble ne pas exister, merci de bien vouloir réessayer .', 'not_found');
            }

            await this.notificationRepo.remove(notification);

            return ApiResponseUtil.ok("", 'Notification supprimée', 'Votre notification a bien été supprimée .');

        } catch (e) {
            return ApiResponseUtil.error('Erreur interne', 'Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }

    async exchangeRequest(context: ExchangeRequestContext): Promise<ApiResponse<AccountDtm>> {
        try {
            const [sender, recipient] = await Promise.all([
                this.accountRepo.findById(context.request_sender_id),
                this.accountRepo.findById(context.request_recipient_id),
            ]);

            if (sender == null || recipient == null) {
                return ApiResponseUtil.error('Session inactive', 'Désolé, votre session a expiré, merci de bien vouloir vous reconnecter et réessayer .', 'unauthorized');
            }

            if (context.request_recipient_id == context.request_sender_id) {
                return ApiResponseUtil.error('Même Identité', 'Désolé, vous ne pouvez pas envoyer une demande de carte à vous-même .', 'conflict');
            }

            // if(recipient != null && sender != null && recipient.status =){

            const exchange: ExchangeRequestModel = {
                id: uuidv4(),
                sender,
                recipient,
                status: ExchangeRequestStatus.WAITING
            };

            await this.exchangeRequestRepo.save(exchange);

            await this.firebaseService.toSave('exchange_requests', {
                exchange: { exchange_id: exchange.id, sender: sender.id, recipient: recipient.id, created_at: new Date() },
                user: { name: recipient.user.name, surname: recipient.user.surname, civility: recipient.user.civility, avatar: recipient.user.picture }
            });

            await this.firebaseService.toPush(sender.fcm_token, 'Demande de carte 🎉', 'Vous avez reçu une demande de carte, merci de bien vouloir accepter ou refuser la demande .');

            return ApiResponseUtil.ok(AccountDtm.fromAccountDtm(sender), 'Demande d\'échange envoyée', 'Votre demande d\'échange a bien été envoyée, vous serez notifié dès que votre demande sera acceptée .');

        } catch (e) {
            return ApiResponseUtil.error('Carte déjà réçu', 'Désolé, vous avez déjà réçu la carte de cette personne .', 'internal_error');
        }
    }

    async refreshToken(accountDtm: AccountDtm, context: RefreshTokenContext): Promise<ApiResponse<String>> {
        try {
            const account: AccountModel | null = await this.accountRepo.findById(accountDtm.id);

            if (account == null) {
                return ApiResponseUtil.error('Session inactive', 'Désolé, votre session a expiré, merci de bien vouloir vous reconnecter et réessayer .', 'unauthorized');
            }

            account.fcm_token = context.refresh_token;
            await this.accountRepo.save(account);

            return ApiResponseUtil.ok("", 'Token refreshed', 'Votre token a bien été actualisé .');

        } catch (e) {
            return ApiResponseUtil.error('Erreur interne', 'Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }

    async responseExchangeRequest(accountDtm: AccountDtm, context: ExchangeResponseContext): Promise<ApiResponse<String>> {
        try {
            const account: AccountModel | null = await this.accountRepo.findById(accountDtm.id);

            if (account == null) {
                return ApiResponseUtil.error('Session inactive', 'Désolé, votre session a expiré, merci de bien vouloir vous reconnecter et réessayer .', 'unauthorized');
            }

            const exchangeRequest: ExchangeRequestModel | null = await this.exchangeRequestRepo.findById(context.exchange_id);

            if (exchangeRequest == null) {
                return ApiResponseUtil.error('Demande inexistante', 'Désolé, cette demande de carte semble ne pas exister, merci de bien vouloir réessayer .', 'not_found');
            }

            if (exchangeRequest.sender.id != account.id || exchangeRequest.recipient.id != context.request_recipient_id) {
                return ApiResponseUtil.error('Demande invalide', 'Désolé, cette demande de carte semble ne pas exister, merci de bien vouloir réessayer .', 'not_found');
            }

            exchangeRequest.status = context.response ? ExchangeRequestStatus.ACCEPTED : ExchangeRequestStatus.REJECTED;

            const recipient: AccountModel = await this.accountRepo.findById(exchangeRequest.recipient.id) as AccountModel;

            await this.prisma.$transaction(async (tx) => {
                await this.exchangeRequestRepo.save(exchangeRequest, tx);
                await this.notificationRepo.save({
                    id: uuidv4(),
                    account: recipient,
                    title: context.response ? 'Reception de Carte acceptée 👏' : 'Reception de Carte refusée 😔',
                    message: context.response
                        ? 'Bonne nouvelle !! vous venez de recevoir une carte de visite de la part de ' + account.user.civility + ' ' + account.user.name + ' 🎉 .'
                        : 'Désolé, une demande d\'accès à une carte de visite vous a été refusée par ' + account.user.civility + ' ' + account.user.name,
                    type: context.response ? NotificationType.APPROVAL : NotificationType.REJECTED,
                }, tx);
            });

            await this.firebaseService.toPush(recipient.fcm_token, context.response ? 'Carte reçue 📇' : 'Carte refusée ❌', context.response ? 'Vous avez reçu une nouvelle carte de visite dans votre réseau .' : 'Votre demande d\'accès à une carte de visite n\'a pas abouti.');
            await this.firebaseService.toDelete('exchange_requests', context.document_id);

            return ApiResponseUtil.ok("", 'Demande d\'échange répondue', 'Votre demande d\'échange a bien été répondue .');

        } catch (e) {
            console.log(e)
            return ApiResponseUtil.error('Erreur interne', 'Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }

    async businessCardReceived(accountDtm: AccountDtm): Promise<ApiResponse<BusinessCardDtm[]>> {
        try {
            const account: AccountModel | null = await this.accountRepo.findById(accountDtm.id);

            if (account == null) {
                return ApiResponseUtil.error('Session inactive', 'Désolé, votre session a expiré, merci de bien vouloir vous reconnecter et réessayer .', 'unauthorized');
            }

            const senders: ExchangeRequestModel[] = await this.exchangeRequestRepo.findByRecipient(account.id);
            const ids = senders.map(sender => sender.sender.user.id);
            const businessCards: BusinessCardModel[] = await this.businessCardRepo.haveTheBusinessCardsReceived(ids);

            return ApiResponseUtil.ok(businessCards.map(BusinessCardDtm.fromBusinessCardDtm), '', 'Liste de cartes de visite reçues 🎉 .');

        } catch (e) {
            return ApiResponseUtil.error('Erreur interne', 'Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }


    async companyListing(account: AccountDtm): Promise<ApiResponse<CompanyKPIDtm[]>> {
        const companies = await this.companyRepo.findAllCompanies();
        const filtered = companies.filter(company => company.locked == false);
        const mapping = filtered.map(company => CompanyDtm.fromCompanyDtm(company));
        return ApiResponseUtil.ok(mapping.map(company => CompanyKPIDtm.fromCompanyKPIDtm(company, account.user.id)), '', 'Liste des entreprises .');
    }

    async companyToggleSubscription(account: AccountDtm, company_id : string): Promise<ApiResponse<CompanyKPIDtm>> {
        try{
            const company = await this.companyRepo.findCompany(company_id);
            if(company == null){
                return ApiResponseUtil.error('Entreprise inexistante', 'L\'entreprise n\'existe pas, merci de bien vouloir réessayer .', 'not_found');
            }
            const subscriber = await this.subscriberRepo.findByUserId(account.user.id , company_id);

            if(subscriber == null){
                const saved = await this.subscriberRepo.save({
                    id : uuidv4(),
                    company : company,
                    user : account.user,
                    is_subscribed : true
                });
                return ApiResponseUtil.ok(CompanyKPIDtm.fromCompanyKPIDtm(CompanyDtm.fromCompanyDtm(company) ,account.user.id), 'Votre abonnement a bien été créé .', 'Votre abonnement a bien été créé .');
            }

            subscriber.is_subscribed = !subscriber.is_subscribed;
            await this.subscriberRepo.save(subscriber);

            const refresh_company = await this.companyRepo.findCompany(company_id) as CompanyModel;

            return ApiResponseUtil.ok(CompanyKPIDtm.fromCompanyKPIDtm(CompanyDtm.fromCompanyDtm(refresh_company) ,account.user.id), 'Votre abonnement a bien été modifié .', 'Votre abonnement a bien été modifié .');
        
        }catch(e){
            return ApiResponseUtil.error('Erreur interne', 'Une erreur inattendue est survenue, merci de bien vouloir réessayer .', 'internal_error');
        }
    }
}
