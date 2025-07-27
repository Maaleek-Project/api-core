import { AccountDtm } from "src/core/domain/dtms/account.dtm";
import { UserRepo } from "../repo/user_repo";
import { ApiResponse, ApiResponseUtil } from "../utils/api-response.util";
import { UserDtm } from "src/core/domain/dtms/user.dtm";
import { Injectable } from "@nestjs/common";
import { AccountRepo } from "../repo/account_repo";

@Injectable()
export class CustomerFeature {

    constructor(
        private readonly accountRepo : AccountRepo,
    ) {}

    async listing() : Promise<ApiResponse<AccountDtm[]>> {
        const customers = await this.accountRepo.findAllCustomer();
        const account = customers.map(account => AccountDtm.fromAccountDtm(account));
        return ApiResponseUtil.ok(account, 'Customers listed 🎉 .');
    }

}