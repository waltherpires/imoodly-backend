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
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalSteps?: number;

  @IsOptional()
  @IsISO8601()
  dueDate?: string;
}
