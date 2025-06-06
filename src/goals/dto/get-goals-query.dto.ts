import { IsArray, IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { GoalStatus } from '../goal.entity';
import { Type } from 'class-transformer';

export class GetGoalsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsEnum(GoalStatus, { each: true, message: 'Status inválido!' })
  @IsArray()
  status?: GoalStatus[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;
}
