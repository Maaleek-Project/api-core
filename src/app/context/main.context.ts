import {  IsNotEmpty } from 'class-validator';

export class ExchangeRequestContext {
    @IsNotEmpty({ message: 'Request sender id is required .' })
    request_sender_id : string;

    @IsNotEmpty({ message: 'Request recipient id is required .' })
    request_recipient_id : string;
}

export class RefreshTokenContext {
    @IsNotEmpty({ message: 'Refresh token is required .' })
    refresh_token : string;
}