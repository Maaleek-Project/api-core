import { Controller,  Res, UseGuards, Req, Body, Post, Get, Put } from "@nestjs/common";
import { MainFeature } from "src/app/features/customer/main.feature";
import { EntityType } from "src/core/decorators/entity_type.decorator";
import { EntityTypeGuard } from "src/core/guards/entity_type.guard";
import { Response } from "express";
import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { ExchangeRequestContext, RefreshTokenContext } from "src/app/context/main.context";

@UseGuards(EntityTypeGuard)
@Controller('main')
export class MainController {
    constructor(
        private readonly feature : MainFeature,
    ) {}

    @EntityType(['Customer'])
    @Get('user-notifications')
    async userNotifications(@Req() req: Request, @Res() res: Response) {
        const notifications = await this.feature.userNotifications(AccountDtm.fromAccountDtm(req['user']));
        const statusMap: Record<string, number> = {
            success: 200,
        };
        const status = statusMap[notifications.code] ;
        return res.status(status).json(notifications);
    }

    @EntityType(['Customer'])
    @Post('exchange-request')
    async exchangeRequest(@Req() req: Request, @Body() context: ExchangeRequestContext, @Res() res: Response) {
        const exchangeRequest = await this.feature.exchangeRequest(context);
        const statusMap: Record<string, number> = {
            success: 200,
            unauthorized: 401,
            conflict: 409,
            internal_error: 500,
        };
        const status = statusMap[exchangeRequest.code] ;
        return res.status(status).json(exchangeRequest);
    }

    @EntityType(['Customer'])
    @Put('refresh-token')
    async refreshToken(@Req() req: Request, @Body() context: RefreshTokenContext, @Res() res: Response) {
        const refreshToken = await this.feature.refreshToken(AccountDtm.fromAccountDtm(req['user']), context);
        const statusMap: Record<string, number> = {
            success: 200,
            unauthorized: 401,
            internal_error: 500,
        };
        const status = statusMap[refreshToken.code] ;
        return res.status(status).json(refreshToken);
    }
}