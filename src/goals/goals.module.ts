import { Module } from '@nestjs/common';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './goal.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LinkRequestsModule } from 'src/link-requests/link-requests.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    LinkRequestsModule,
    NotificationsModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([Goal]),
  ],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}
