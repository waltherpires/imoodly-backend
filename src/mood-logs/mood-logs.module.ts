import { Module } from '@nestjs/common';
import { MoodLogsService } from './mood-logs.service';
import { MoodLogsController } from './mood-logs.controller';

@Module({
  providers: [MoodLogsService],
  controllers: [MoodLogsController]
})
export class MoodLogsModule {}
