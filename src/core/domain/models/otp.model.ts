export interface OtpModel {
    id: number ;
    type: string;
    code : string;
    value: string;
    country_id: number;
    state: string;
    attempt: number;
    created_at?: Date;
    updated_at?: Date;
}