import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsString,
  Matches,
} from 'class-validator';
import { Emotion } from 'src/common/enums/enums';

export class CreateMoodLogDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Emotion, { each: true })
  emotions: Emotion[];
}
