import { NotificationType } from "../notification.entity";
import { Expose, Type } from "class-transformer";
import { UserDto } from "src/users/dto/user.dto";

export class NotificationResponseDto {

  @Expose()
  id: number;

  @Expose()
  type: NotificationType;

  @Expose()
  @Type(() => UserDto)
  sender: UserDto;

  @Expose()
  @Type(() => UserDto)
  receiver: UserDto;

  @Expose()
  resourceId: string;

  @Expose()
  data: any;

  @Expose()
  isRead: boolean;

  @Expose()
  createdAt: Date;
}
