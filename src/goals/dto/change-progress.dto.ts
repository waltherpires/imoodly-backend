import { IsInt, IsOptional } from "class-validator";

export class ChangeProgressDto {
    @IsOptional()
    @IsInt({ message: 'A quantidade deve ser um número inteiro.' })
    quantity?: number;
}