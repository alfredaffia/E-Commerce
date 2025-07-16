import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty({message:''})
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
