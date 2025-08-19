import { Controller,  Res, UseGuards, Req, Body, Put } from "@nestjs/common";
import { UpdateCustomerContext, UpdatePasswordContext } from "src/app/context/setting.context";
import { Response } from "express";
import { SettingFeature } from "src/app/features/customer/setting.feature";
import { EntityType } from "src/core/decorators/entity_type.decorator";
import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { EntityTypeGuard } from "src/core/guards/entity_type.guard";

@UseGuards(EntityTypeGuard)
@Controller('user')
export class UserController {

    constructor(
        private readonly feature : SettingFeature,
    ) {}


    @EntityType(['Customer'])
    @Put('update-password')
    async updatePassword(@Req() req: Request, @Body() context: UpdatePasswordContext, @Res() res: Response) {
        const update = await this.feature.updatePassword(AccountDtm.fromAccountDtm(req['user']), context);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            conflict: 409,
            internal_error: 500,
        };
        const status = statusMap[update.code] ;
        return res.status(status).json(update);
    }

    @EntityType(['Customer'])
    @Put('update-info')
    async updateCustomer(@Req() req: Request, @Body() context: UpdateCustomerContext, @Res() res: Response) {
        const update = await this.feature.updateCustomerInfo(AccountDtm.fromAccountDtm(req['user']), context);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            conflict: 409,
            internal_error: 500,
        };
        const status = statusMap[update.code] ;
        return res.status(status).json(update);
    }
}