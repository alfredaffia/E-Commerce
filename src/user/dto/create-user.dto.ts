import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { UserRole } from "../../auth/enum/user.role.enum";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email:string

    @IsString()
    @IsNotEmpty({message:'input username'})
    userName:string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({ minLength: 6, minUppercase: 1, minNumbers: 1, minSymbols: 0, minLowercase: 1 })
    password: string;

    @IsOptional()
    role:UserRole

    @IsOptional()
    isBlocked:boolean
}
