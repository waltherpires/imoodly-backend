import { Expose, Type } from "class-transformer";
import { UserDto } from "src/users/dto/user.dto";
import { LinkRequestStatus } from "../link-request.entity";

export class LinkRequestDto {

    @Expose()
    id: number;

    @Expose()
    @Type(() => UserDto)
    recipient: UserDto;

    @Expose()
    @Type(() => UserDto)
    requester: UserDto;

    @Expose()
    status: LinkRequestStatus;

    @Expose()
    createdAt: Date;

    @Expose()
    updateAt: Date;
}