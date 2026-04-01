import { AccountDtm } from "./account.dtm";

export class CustomerDtm {
    id : string;
    civility : string;
    name : string;
    surname : string;
    number : string;

    constructor(id : string, civility : string, name : string, surname : string, number : string) {
        this.id = id;
        this.civility = civility;
        this.name = name;
        this.surname = surname;
        this.number = number;
    }

    static fromCustomerDtm(customer: AccountDtm): CustomerDtm {
        return new CustomerDtm(customer.id, customer.user.civility, customer.user.name, customer.user.surname, `+${customer.country.code} ${customer.user.number}`);
    }
}