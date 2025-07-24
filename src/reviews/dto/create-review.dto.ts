import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {
    @IsNotEmpty({message:'productId shouldnot be empty'})
    @IsString({message:'ProductId should be string'})
    productId:string;

    @IsNotEmpty({message:'ratings should not be empty'})
    @IsNumber()
    ratings:number;

    @IsNotEmpty({message:'comment should not be empty'})
    @IsString()
    comments:string

}
