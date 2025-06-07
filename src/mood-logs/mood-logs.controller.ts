import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MoodLogsService } from './mood-logs.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMoodLogDto } from './dto/create-moodlog.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { MoodLogDto } from './dto/moodlog.dto';

@UseGuards(AuthGuard)
@Controller('mood-logs')
export class MoodLogsController {
  constructor(private moodLogsService: MoodLogsService) {}

  @Post()
  @Serialize(MoodLogDto)
  async createPost(@Request() req, @Body() body: CreateMoodLogDto) {
    const loggedUser = req.user;

    return this.moodLogsService.createMoodLog(loggedUser.id, body);
  }

  @Get('monthly-summary/:userId')
  async getEmotionGraphData(@Param('userId') userId: number) {
    return await this.moodLogsService.getMonthlyEmotionSummary(userId);
  }

  @Get('user/:userId')
  async getUserMoodLogs(@Param('userId') userId: number, @Request() req) {
    const loggedUser = req.user;

    const canAccess = await this.moodLogsService.canAccessMoodLogs(
      loggedUser,
      userId,
    );

    if (!canAccess) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esses dados.',
      );
    }

    return this.moodLogsService.getMoodLogs(userId);
  }

  @Patch(':moodLogId')
  @Serialize(MoodLogDto)
  async updateMoodLog(
    @Param('moodLogId') moodLogId: number,
    @Request() req,
    @Body() body: Partial<CreateMoodLogDto>,
  ) {
    const loggedUserId = req.user.id;

    const updatedMoodLog = await this.moodLogsService.editMoodLog(moodLogId, body, loggedUserId);

    return updatedMoodLog;
  }
}
