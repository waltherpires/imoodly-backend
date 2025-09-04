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

const MIN_BIRTHDATE = new Date('1910-01-01');
const TODAY = new Date();
const MAX_BIRTHDATE = new Date(
  TODAY.getFullYear() - 18,
  TODAY.getMonth(),
  TODAY.getDate(),
);

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
  @MinDate(MIN_BIRTHDATE, { message: 'Data mínima: 01/01/1910' })
  @MaxDate(MAX_BIRTHDATE, { message: 'Idade mínima: 18 anos' })
  birthdate: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  crp?: string;
}
