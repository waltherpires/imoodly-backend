import { IsEnum, IsOptional } from "class-validator";
import { GoalStatus } from "../goal.entity";

export class GetGoalsQueryDto {
    @IsOptional()
    @IsEnum(GoalStatus, { message: 'Status inválido!' })
    status?: GoalStatus;
}