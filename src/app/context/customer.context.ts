import { IsString, IsNotEmpty } from 'class-validator';

export  class CreateCustomerContext {

    @IsNotEmpty({ message: 'Name is required .' })
    name : string;

    @IsNotEmpty({ message: 'Surname is required .' })
    surname : string;

    @IsNotEmpty({ message: 'Civility is required .' })
    civility : string;

    @IsNotEmpty({ message: 'Number is required .' })
    number : string;

    @IsNotEmpty({ message: 'Please select a country .' })
    country_id : string;

    @IsNotEmpty({ message: 'Email is required .' })
    email : string;
}

