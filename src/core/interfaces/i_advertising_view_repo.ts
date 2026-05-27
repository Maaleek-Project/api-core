import { AdvertisingViewModel } from "../domain/models/advertising_view.model";

export interface IAdvertisingViewRepo {
    save(view: AdvertisingViewModel): Promise<AdvertisingViewModel>;
    countByAdvertisingId(advertising_id: string): Promise<number>;
}
