import { IsEnum, IsString } from 'class-validator';
import { EntityType } from '../comment.entity';

export class CreateCommentDto {
  @IsEnum(EntityType)
  entityType: EntityType;

  @IsString()
  entityId: string;

  @IsString()
  content: string;
}
