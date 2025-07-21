import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { InitiatedContext, SignInContext, SignUpContext, ValidateCodeContext } from "src/app/context/authentification.context";
import { AuthentificationFeature } from "src/app/features/authentification.feature";
import { Response } from "express";

@Controller('auth')
export class AuthentificationController {

    constructor(
        private readonly feature: AuthentificationFeature,
    ) {}

    @Post('sign-up')
    async signUp(@Req() req: Request, @Body() context: SignUpContext, @Res() res: Response) {
        const signUp = await this.feature.signUp(context);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            internal_error: 500,
            conflict : 409,
        };
        const status = statusMap[signUp.code] ;
        return res.status(status).json(signUp);
    }

    @Post('initiated')
    async initiated(@Req() req: Request, @Body() context: InitiatedContext, @Res() res: Response) {
        const initiated = await this.feature.initiated(context);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            internal_error: 500,
        };
        const status = statusMap[initiated.code] ;
        return res.status(status).json(initiated);
    }

    @Post('validate-code')
    async validateCode(@Req() req: Request, @Body() context: ValidateCodeContext, @Res() res: Response) {
        const validation = await this.feature.validateCode(context);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            internal_error : 500,
            conflict: 409,
        };
        const status = statusMap[validation.code] ;
        return res.status(status).json(validation);
    }

    @Post('sign-in')
    async signIn(@Req() req: Request, @Body() context: SignInContext, @Res() res: Response) {
        const signIn = await this.feature.signIn(context);
        const statusMap: Record<string, number> = {
            success: 200,
            not_found: 404,
            internal_error: 500,
            conflict : 409,
        };
        const status = statusMap[signIn.code] ;
        return res.status(status).json(signIn);
    }

}