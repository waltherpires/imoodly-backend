import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsString, IsOptional, IsISO8601 } from "class-validator";
import { UserRole } from "src/common/enums/enums";

export class CreateUserDto {
    @IsEmail()
    email: string

    @IsString()
    name: string;

    @IsString()
    password: string;

    @IsISO8601()
    birthdate: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsOptional()
    @IsString()
    crp?: string;
}