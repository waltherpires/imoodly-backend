import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { NotificationType } from './notification.entity';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { NotificationResponseDto } from './dto/notification-response.dto';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Post()
  @Serialize(NotificationResponseDto)
  async createNotification(
    @Body() body: CreateNotificationDto,
    @Req() req: any,
  ) {
    const senderId = req.user.id;
    return this.notificationService.createNotification({
      ...body,
      senderId: String(senderId),
    });
  }

  @Serialize(NotificationResponseDto)
  @Get()
  async getUserNotifications(
    @Req() req: any,
    @Query('type') type?: NotificationType,
    @Query('isRead') isRead?: string,
  ) {
    const userId = req.user.id;
    const isReadBool = isRead === undefined ? undefined : isRead === 'true';
    return this.notificationService.getUserNotifications(
      userId,
      type,
      isReadBool,
    );
  }

  @Patch(':id/read')
  @Serialize(NotificationResponseDto)
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(Number(id));
  }
}
