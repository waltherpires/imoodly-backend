import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
    constructor(private readonly notificationService: NotificationsService) {}

    @Post()
    async createNotification(@Body() body: CreateNotificationDto, @Req() req: any) {
        const senderId = req.user.id;
        return this.notificationService.createNotification({
            ...body,
            senderId: String(senderId),
        });
    }

    @Get()
    async getUserNotifications(@Req() req: any) {
        const userId = req.user.id;
        return this.notificationService.getUserNotification(userId);
    }

    @Get('unread')
    async getUnreadNotifications(@Req() req: any) {
        const userId = req.user.id;
        return this.notificationService.getUnreadNotifications(userId);
    }

    @Patch(':id/read')
    async markAsRead(@Param('id') id: string) {
        return this.notificationService.markAsRead(Number(id));
    }
}
