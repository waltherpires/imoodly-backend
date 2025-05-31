import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification, NotificationType } from './notification.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async createNotification(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepo.create({
      type: dto.type as NotificationType,
      sender: { id: Number(dto.senderId) } as User,
      receiver: { id: Number(dto.receiverId) } as User,
      resourceId: Number(dto.resourceId),
    });

    return this.notificationRepo.save(notification);
  }

  async getUserNotifications(
    userId: number,
    type?: NotificationType,
    isRead?: boolean,
  ): Promise<Notification[]> {
    const where: any = { receiver: { id: userId } };
    if (type) {
      where.type = type;
    }
    if (typeof isRead === 'boolean') {
      where.isRead = isRead;
    }

    return this.notificationRepo.find({
      where,
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: number): Promise<Notification> {
    const notification = await this.notificationRepo.findOneByOrFail({
      id: notificationId,
    });
    notification.isRead = true;
    return this.notificationRepo.save(notification);
  }
}
