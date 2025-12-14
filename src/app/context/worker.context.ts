import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWorkerContext {
    @IsOptional({ message: 'Name is required .' })
    name : string ;

    @IsOptional({ message: 'Surname is required .' })
    surname : string;

    @IsOptional({ message: 'Civility is required .' })
    civility : string;

    @IsNotEmpty({ message: 'Number is required .' })
    number : string;

    @IsNotEmpty({ message: 'Please select a country .' })
    country_id : string;

    @IsOptional({ message: 'Email is required .' })
    email : string;

    @IsOptional({ message: 'Type is required .' })
    type : string;
}