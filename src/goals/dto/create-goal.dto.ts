import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @Matches(/^[\p{L}\p{N} '-,]*$/u, {
    message: 'Não são permitidos caracteres especiais ou emojis',
  })
  title: string;

  @IsString()
  @Matches(/^[\p{L}\p{N} '-,]*$/u, {
    message: 'Não são permitidos caracteres especiais ou emojis',
  })
  description: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalSteps?: number;

  @IsOptional()
  @IsISO8601()
  dueDate?: string;
}
