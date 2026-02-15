import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAdvertisingContext {
    @IsNotEmpty({ message: 'Title is required .' })
    title : string;

    @IsNotEmpty({ message: 'Description is required .' })
    description : string;

    @IsNotEmpty({ message: 'Type is required .' })
    @IsString()
    type : string; // 'image' ou 'video'
}

