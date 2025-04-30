import { Expose } from "class-transformer";

export class MoodLogDto {
    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    createdAt: Date;

    @Expose()
    tags: string[];
}