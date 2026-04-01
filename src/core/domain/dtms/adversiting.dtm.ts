import { AdvertisingModel } from "../models/advertising.model";

export class AdvertisingDtm {
    id: string;
    title : string;
    type : string;
    description : string;
    link : string;
    is_active : boolean;
    is_deleted : boolean;

    constructor(id: string, title: string, type : string, description: string, link: string, is_active: boolean, is_deleted: boolean) {
        this.id = id;
        this.title = title;
        this.type = type ;
        this.description = description;
        this.link = link;
        this.is_active = is_active;
        this.is_deleted = is_deleted;
    }

    static fromAdvertisingDtm(advertising: AdvertisingModel): AdvertisingDtm {
        return new AdvertisingDtm(advertising.id, advertising.title, advertising.type, advertising.description, advertising.link ?? '', advertising.is_active!, advertising.is_deleted!);
    }
}