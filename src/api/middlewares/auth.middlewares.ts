import { Injectable, NestMiddleware } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Request, Response } from "express";
import { AuthentificationService } from "src/core/services/authenfication.service";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    private prisma : PrismaService;
    private authentificationService : AuthentificationService;

    constructor(
        private readonly moduleRef: ModuleRef,
    ) {}

    async use(req: Request, res: Response, next: () => void) {

        if (!this.prisma) {
            this.prisma = await this.moduleRef.resolve(PrismaService, undefined, { strict: false });
        }

        if (!this.authentificationService) {
            this.authentificationService = await this.moduleRef.resolve(AuthentificationService, undefined, { strict: false });
        }

        const token = req.headers['authorization'];
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'You must be authenticated to access this resource.',
            });
        }
        const key = token.split(' ')[1];

        try{
            const isValid = await this.authentificationService.validateToken(key);

            if(!isValid)
            {
                return res.status(401).json({
                    message: 'You must be authenticated to access this resource .',
                });
            }
        }catch(e){
            return res.status(401).json({
                message: 'Session expired .',
            });
        }

        const model = await this.prisma.token.findUnique({
            where: {
                token: key,
                type: 'to_connect'
            }
        });

        if(model != null)
        {
            const account = await this.prisma.account.findUnique({
                where : {
                    id : model.account_id
                },
                include : {
                    user : true,
                    country : true,
                    entity : true
                }
            });

            req['user'] = account;

            return next();
        }

        return res.status(401).json({
                message: 'You must be authenticated to access this resource.',
        });
        
       
        
    }
}