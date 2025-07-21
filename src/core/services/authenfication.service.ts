const bcrypt = require('bcrypt');
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthentificationService {

    SALT_ROUNDS = 10;

    constructor() { }


    async hashPassword(password: string) {
        return await bcrypt.hash(password, this.SALT_ROUNDS);
    }

    async comparePassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    }

}