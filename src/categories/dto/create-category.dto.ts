import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty({message:'title must have a value'})
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
