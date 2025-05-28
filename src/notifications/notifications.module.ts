import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { User } from 'src/users/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Notification, User])],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService]
})
export class NotificationsModule {}
