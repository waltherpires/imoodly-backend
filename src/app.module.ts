import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodLogsModule } from './mood-logs/mood-logs.module';
import { AuthModule } from './auth/auth.module';
import { LinkRequestsModule } from './link-requests/link-requests.module';
import { GoalsModule } from './goals/goals.module';
import { TypeOrmConfigService } from './config/typeorm.config';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development.docker', '.env.production', '.env.test']
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UsersModule,
    MoodLogsModule,
    AuthModule,
    LinkRequestsModule,
    GoalsModule,
    NotificationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
