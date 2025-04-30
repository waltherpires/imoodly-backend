import { Module } from '@nestjs/common';
import { MoodLogsService } from './mood-logs.service';
import { MoodLogsController } from './mood-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodLog } from './mood-log.entity';
import { MoodEmotion } from './mood-emotion.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { LinkRequestsModule } from 'src/link-requests/link-requests.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([MoodLog, MoodEmotion]),
    UsersModule,
    LinkRequestsModule,
  ],
  providers: [MoodLogsService],
  controllers: [MoodLogsController],
})
export class MoodLogsModule {}
