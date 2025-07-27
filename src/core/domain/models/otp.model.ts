export interface OtpModel {
    id: string ;
    type: string;
    code : string;
    value: string;
    country_id: string;
    state: string;
    attempt: number;
    created_at?: Date;
    updated_at?: Date;
}