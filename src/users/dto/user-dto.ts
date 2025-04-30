import { Expose } from "class-transformer";

export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    fullname: string;

    @Expose()
    birthdate: Date;
}