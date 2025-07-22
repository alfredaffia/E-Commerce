import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {
    
    @IsString({message:'title cannot be blank'})
    @IsNotEmpty()
    title:string;

    @IsNotEmpty({message:'description cannot be empty'})
    @IsString()
    description:string;

    @IsNumber({maxDecimalPlaces:2},{message:'price should be number'})
    @IsNotEmpty({message:'message:price should not be empty'})
    @IsPositive({message:'price should be a positive number'})
    price:number;

    @IsNumber({},{message:'stock should not be empty'})
    @IsNotEmpty({message:'stock should not be empty'})
    @Min(0,{message:'stock cannot be negative'})
    stock:number;

    @IsString({message:'categoryId should be a string'})
    @IsNotEmpty({message:'category should not be empty'})
    category:string
}
