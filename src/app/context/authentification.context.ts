import { IsString, IsNotEmpty } from 'class-validator';

export class InitiatedContext {

    @IsNotEmpty({ message: 'Login is required .' })
    login : string;

    @IsNotEmpty({ message: 'Please select a country .' })
    country_id : string;
}

export class ValidateCodeContext {

    @IsString({ message: 'Code is required .' })
    code : string;

    @IsNotEmpty({ message: 'Please select a country .' })
    country_id : string;

    @IsNotEmpty({ message: 'Value is required .' })
    value : string;

    @IsNotEmpty({ message: 'Type is required .' })
    type : string;
}

export class SignUpContext {
    
    @IsNotEmpty({ message: 'Login is required .' })
    login : string;

    @IsNotEmpty({ message: 'Please select a country .' })
    country_id : string;

    @IsNotEmpty({ message: 'Password is required .' })
    password : string;

    @IsNotEmpty({ message: 'Civility is required .' })
    civility : string;

    @IsNotEmpty({ message: 'Name is required .' })
    name : string;

    @IsNotEmpty({ message: 'Surname is required .' })
    surname : string;
}

export class SignInContext {
    @IsNotEmpty({ message: 'Login is required .' })
    login : string;

    @IsNotEmpty({ message: 'Please select a country .' })
    password : string;

    @IsNotEmpty({ message: 'Please select a country .' })
    country_id : string;
}