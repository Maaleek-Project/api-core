import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCompanyContext {

    @IsNotEmpty({ message: 'Company name is required .' })
    company_name : string;

    @IsNotEmpty({ message: 'Company number is required .' })
    company_number : string;

    @IsNotEmpty({ message: 'Company email is required .' })
    company_email : string;

    @IsNotEmpty({ message: 'Company address is required .' })
    company_address : string;

    @IsNotEmpty({ message: 'Manager name is required .' })
    manager_name : string;

    @IsNotEmpty({ message: 'Manager surname is required .' })
    manager_surname : string;

    @IsNotEmpty({ message: 'Manager civility is required .' })
    manager_civility : string;

    @IsNotEmpty({ message: 'Manager number is required .' })
    manager_number : string;

    @IsNotEmpty({ message: 'Manager email is required .' })
    manager_email : string;

    @IsNotEmpty({ message: 'Please select a country .' })
    country_id : string;
}