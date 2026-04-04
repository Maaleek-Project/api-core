import { IsString, IsNotEmpty, IsIn } from 'class-validator';

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
    @IsIn(['Mr', 'Mme', 'Mlle'], { message: 'Manager civility must be Mr, Mme or Mlle .' })
    manager_civility : string;

    @IsNotEmpty({ message: 'Manager number is required .' })
    manager_number : string;

    @IsNotEmpty({ message: 'Manager email is required .' })
    manager_email : string;

    @IsNotEmpty({ message: 'Please select a country .' })
    country_id : string;
}


export class UpdateCompanyBusinessCardContext {
    @IsNotEmpty({ message: 'Front text color is required .' })
    front_text_color : string;

    @IsNotEmpty({ message: 'Back text color is required .' })
    back_text_color : string;

    @IsNotEmpty({ message: 'Front background color is required .' })
    front_background_color : string;

    @IsNotEmpty({ message: 'Back background color is required .' })
    back_background_color : string; 

    @IsNotEmpty({ message: 'Company is required .' })
    slogan : string;

}


export class UpdateManagerInfoContext {
    @IsNotEmpty({ message: 'Manager name is required .' })
    manager_name : string;

    @IsNotEmpty({ message: 'Manager surname is required .' })
    manager_surname : string;

    @IsNotEmpty({ message: 'Manager civility is required .' })
    @IsIn(['Mr', 'Mme', 'Mlle'], { message: 'Manager civility must be Mr, Mme or Mlle .' })
    manager_civility : string;

    @IsNotEmpty({ message: 'Manager email is required .' }) 
    manager_email : string;
}

export class UpdateCompanyBasicInfoContext {
    @IsNotEmpty({ message: 'Company name is required .' })
    company_name : string;

    @IsNotEmpty({ message: 'Company address is required .' })
    company_address : string;
}

export class UpdateCompanyAuthPasswordContext {
    @IsNotEmpty({ message: 'Current password is required .' })
    current_password : string;

    @IsNotEmpty({ message: 'New password is required .' })
    new_password : string;

    @IsNotEmpty({ message: 'Confirm new password is required .' })
    confirm_new_password : string;
}