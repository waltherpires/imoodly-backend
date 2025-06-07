import { Expose } from 'class-transformer';

export class MoodLogDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Expose()
  emotions: string[];

  @Expose()
  userId: number;
}
