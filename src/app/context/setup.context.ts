import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePaymentProviderContext {
    @IsNotEmpty({ message: 'Libelle is required .' })
    libelle : string;

    @IsNotEmpty({ message: 'Description is required .' })
    description : string;
}

export class CreateCountryContext {
    @IsNotEmpty({ message: 'Alias is required .' })
    alias : string;

    @IsNotEmpty({ message: 'Flag is required .' })
    flag : string;

    @IsNotEmpty({ message: 'Currency is required .' })
    currency : string;

    @IsNotEmpty({ message: 'Libelle is required .' })
    libelle : string;

    @IsNotEmpty({ message: 'Indicatif is required .' })
    indicatif : string;
}

export class CreateOfferContext {
    @IsNotEmpty({ message: 'Libelle is required .' })
    libelle : string;

    @IsNotEmpty({ message: 'Code is required .' })
    code : string;

    @IsNotEmpty({ message: 'Sharing number is required .' })
    shared_number : string;
}