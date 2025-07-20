import { OtpModel } from "../domain/models/otp.model";

export interface IOtpRepo {
    fetchByValue(value: string, country_id: number): Promise<OtpModel | null>;
    save(otp : OtpModel) : Promise<OtpModel>
    findAction(type: string, state :string, value: string, country_id: number): Promise<OtpModel | null>;
    toValidate(otp : OtpModel, code : string) : Promise<OtpModel>
    remove(otp : OtpModel) : Promise<OtpModel>
}