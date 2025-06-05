import { IsArray, IsEnum, IsNumber, IsOptional } from "class-validator";
import { GoalStatus } from "../goal.entity";
import { Type } from "class-transformer";

export class GetGoalsQueryDto {

    
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