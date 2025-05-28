import { IsEnum, IsString } from "class-validator";

export class CreateNotificationDto {

    @IsEnum(['goal', 'post'])
  type: 'goal' | 'post';

  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;
  
  @IsString()
  resourceId: string;
}
