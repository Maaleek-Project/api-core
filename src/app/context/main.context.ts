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

export class ExchangeResponseContext {
    @IsNotEmpty({ message: 'Exchange id is required .' })
    exchange_id : string;

    @IsNotEmpty({ message: 'Response is required .' })
    response : boolean;

    @IsNotEmpty({ message: 'Request recipient id is required .' })
    request_recipient_id : string;

    @IsNotEmpty({ message: 'Document id is required .' })
    document_id : string;
}