export interface OfferModel {
    id: string;
    libelle: string;
    sharing_number: number;
    code: string;
    badge_color : string;
    periodicity : number;
    price : number;
    description : string;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
}