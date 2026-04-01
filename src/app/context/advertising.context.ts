import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateAdvertisingContext {

    @IsNotEmpty({ message: 'Title is required .' })
    @IsString()
    title: string;

    @IsNotEmpty({ message: 'Description is required .' })
    @IsString()
    description: string;

    @IsNotEmpty({ message: 'Type is required .' })
    @IsIn(['text', 'image', 'video'], { message: 'Type must be text, image or video .' })
    type: string;

    @IsOptional()
    @IsString()
    link?: string;
}
