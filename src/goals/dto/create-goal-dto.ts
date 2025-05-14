import { IsISO8601, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateGoalDto {
    
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsNumber()
    @IsOptional()
    totalSteps?: number;

    @IsISO8601()
    @IsOptional()
    dueDate?: string;
}