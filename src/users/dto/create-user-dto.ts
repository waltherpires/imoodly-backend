import { IsDateString, IsEmail, IsEnum, IsString } from "class-validator";
import { UserRole } from "src/common/enums/enums";

export class CreateUserDto {
    @IsEmail()
    email: string

    @IsString()
    fullname: string;

    @IsString()
    password: string;

    @IsDateString()
    birthdate: string;

    @IsEnum(UserRole)
    role: UserRole;
}