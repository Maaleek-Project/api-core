const bcrypt = require('bcrypt');
import { Injectable } from "@nestjs/common";
import { AccountDtm } from "../domain/dtms/account.dtm";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthentificationService {

    SALT_ROUNDS = 10;

    constructor(private readonly jwtService: JwtService) { }


    async hashPassword(password: string) {
        return await bcrypt.hash(password, this.SALT_ROUNDS);
    }

    async comparePassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    }

    async generateToken(account : AccountDtm) {
        const payload = { id : account.id, name : account.user.name, surname : account.user.surname, number : account.user.number, entity : account.entity.libelle } ;
        const secret = process.env.JWT_SECRET;
        return  this.jwtService.signAsync(payload, {
            secret,
            expiresIn: '1d'
        });
    }

    async validateToken(token: string) : Promise<AccountDtm> {
        try{
            const secret = process.env.JWT_SECRET;
            return this.jwtService.verifyAsync(token, {
                secret,
                ignoreExpiration: false,
            });
        }catch(e){
            throw new Error("Invalid token .");
        }
    }

}