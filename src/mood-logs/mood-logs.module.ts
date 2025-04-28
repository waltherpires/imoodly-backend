import { Module } from '@nestjs/common';
import { MoodLogsService } from './mood-logs.service';

@Module({
  providers: [MoodLogsService]
})
export class MoodLogsModule {}
