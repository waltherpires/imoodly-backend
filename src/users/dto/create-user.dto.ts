import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsString,
  IsOptional,
  IsISO8601,
  IsDate,
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

  @Type(() => Date)
  @IsDate()
  @MinDate(new Date('1910-01-01'))
  @MaxDate(new Date(new Date().setFullYear(new Date().getFullYear() - 18)))
  birthdate: Date;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  crp?: string;
}
