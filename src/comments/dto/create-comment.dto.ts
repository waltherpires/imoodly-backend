import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { EntityType } from '../comment.entity';

export class CreateCommentDto {
  @IsEnum(EntityType)
  entityType: EntityType;

  @IsNumber()
  entityId: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}
