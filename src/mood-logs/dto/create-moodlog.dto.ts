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
  @Matches(/^[\p{L}\p{N} '-,]*$/u, {
    message: 'Não são permitidos caracteres especiais ou emojis',
  })
  title: string;

  @IsString()
  @Matches(/^[\p{L}\p{N} '-,]*$/u, {
    message: 'Não são permitidos caracteres especiais ou emojis',
  })
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Emotion, { each: true })
  emotions: Emotion[];
}
