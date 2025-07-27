import { OtpModel } from "../models/otp.model";

export class OtpDtm {
    id: string;
    type: string;
    value: string;
    country_id: string;

    constructor(id: string, type: string, value: string, country_id: string) {
        this.id = id;
        this.type = type;
        this.value = value;
        this.country_id = country_id;
    }

    static fromOtpDtm(otp: OtpModel): OtpDtm {
        return new OtpDtm(otp.id, otp.type, otp.value, otp.country_id);
    }
}