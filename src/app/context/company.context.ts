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


export class UpdateCompanyConfigContext {
    @IsNotEmpty({ message: 'Front text color is required .' })
    front_text_color : string;

    @IsNotEmpty({ message: 'Back text color is required .' })
    back_text_color : string;

    @IsNotEmpty({ message: 'Front background color is required .' })
    front_background_color : string;

    @IsNotEmpty({ message: 'Back background color is required .' })
    back_background_color : string; 

    @IsNotEmpty({ message: 'Company name is required .' })
    company_name : string;

    @IsNotEmpty({ message: 'Company number is required .' })
    company_number : string;


    @IsNotEmpty({ message: 'Company address is required .' })
    company_address : string;

  

    @IsNotEmpty({ message: 'Manager username is required .' })
    manager_username : string;

    @IsNotEmpty({ message: 'Manager number is required .' })
    manager_number : string;

    @IsNotEmpty({ message: 'Manager email is required .' })
    manager_email : string;


    @IsNotEmpty({ message: 'Company is required .' })
    slogan : string;


}