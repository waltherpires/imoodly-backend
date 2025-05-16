import { Expose, Type } from "class-transformer";
import { UserDto } from "./user.dto";

export class PsychologistDto {
    @Expose()
    id: number;

    @Expose()
    crp: string;

    @Expose()
    connectionStatus: string;

    @Expose()
    @Type(() => UserDto)
    user: UserDto;
}