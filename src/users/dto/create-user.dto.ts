import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsString,
  IsOptional,
  MinDate,
  MaxDate,
  Matches,
} from 'class-validator';
import { UserRole } from 'src/common/enums/enums';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^[\p{L}\p{N} '@\/#!$%&*,\-]*$/u, {
    message: 'Senha contém caracteres inválidos',
  })
  name: string;

  @IsString()
  password: string;

 
  @IsDateString()
  @MinDate(new Date('1910-01-01'))
  @MaxDate(new Date(new Date().setFullYear(new Date().getFullYear() - 18)))
  birthdate: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  crp?: string;
}
