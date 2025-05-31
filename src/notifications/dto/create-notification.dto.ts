import { IsEnum, IsOptional, IsString } from "class-validator";
import { NotificationType } from "../notification.entity";

export class CreateNotificationDto {

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;
  
  @IsOptional()
  @IsString()
  resourceId?: string;

  @IsOptional()
  data?: any;
}
