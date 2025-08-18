import {  IsNotEmpty } from 'class-validator';

export  class UpdateCustomerContext {

    @IsNotEmpty({ message: 'Name is required .' })
    name : string;

    @IsNotEmpty({ message: 'Surname is required .' })
    surname : string;

    @IsNotEmpty({ message: 'Civility is required .' })
    civility : string;

}

export class UpdatePasswordContext {

    @IsNotEmpty({ message: 'Last password is required .' })
    last_password : string;

    @IsNotEmpty({ message: 'New password is required .' })
    password : string;

}