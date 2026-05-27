import { BusinessCardViewModel } from "../domain/models/business_card_view.model";

export interface IBusinessCardViewRepo {
    save(view: BusinessCardViewModel): Promise<BusinessCardViewModel>;
    countByBusinessCardId(business_card_id: string): Promise<number>;
    findViewersByBusinessCardId(business_card_id: string): Promise<BusinessCardViewModel[]>;
}
