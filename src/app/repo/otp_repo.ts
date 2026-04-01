import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { OtpModel } from "src/core/domain/models/otp.model";
import { IOtpRepo } from "src/core/interfaces/i_otp_repo";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class OtpRepo implements IOtpRepo {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async remove(model: OtpModel, tx?: Prisma.TransactionClient): Promise<OtpModel> {
        const client = tx ?? this.prisma;
        const otp = await client.otp.delete({
            where: { id: model.id }
        });
        return this.toOtp(otp);
    }

    async save(model: OtpModel, tx?: Prisma.TransactionClient): Promise<OtpModel> {
        const client = tx ?? this.prisma;
        const otp = await client.otp.upsert({
            where: { id: model.id },
            update: this.toDatabase(model),
            create: this.toDatabase(model)
        });
        return this.toOtp(otp);
    }

    async fetchByValue(value: string, country_id: string): Promise<OtpModel | null> {
        const otp = await this.prisma.otp.findFirst({
            where: { value, country_id }
        });
        return otp ? this.toOtp(otp) : null;
    }

    async findAction(type: string, state: string, value: string, country_id: string): Promise<OtpModel | null> {
        const otp = await this.prisma.otp.findFirst({
            where: { type, state, value, country_id }
        });
        return otp ? this.toOtp(otp) : null;
    }

    async toValidate(otp: OtpModel, code: string): Promise<OtpModel> {
        const last_date = otp.updated_at!;
        const only_date = new Date(Date.now());

        if (otp.attempt == 3 && last_date.toDateString() == only_date.toDateString()) {
            throw new Error('Too many tries, try later .');
        }

        otp.attempt += 1;

        if (last_date.toDateString() != only_date.toDateString())
            otp.attempt = 1;

        otp.code = code;
        otp.updated_at = only_date;

        const updated = await this.prisma.otp.update({
            where: { id: otp.id },
            data: otp
        });
        return this.toOtp(updated);
    }

    private toOtp(otp: any): OtpModel {
        return {
            id: otp.id,
            type: otp.type,
            attempt: otp.attempt,
            value: otp.value,
            country_id: otp.country_id,
            state: otp.state,
            created_at: otp.created_at,
            updated_at: otp.updated_at,
            code: otp.code
        };
    }

    private toDatabase(otp: OtpModel): any {
        return {
            id: otp.id,
            type: otp.type,
            attempt: otp.attempt,
            value: otp.value,
            code: otp.code,
            country_id: otp.country_id,
            state: otp.state
        };
    }
}
