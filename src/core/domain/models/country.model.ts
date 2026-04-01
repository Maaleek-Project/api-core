export interface CountryModel {
    id: string;
    libelle: string;
    code: string;
    alias: string;
    flag: string;
    currency: string;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
}