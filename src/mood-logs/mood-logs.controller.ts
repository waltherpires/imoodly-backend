import { Body, Controller, ForbiddenException, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { MoodLogsService } from './mood-logs.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMoodLogDto } from './dto/create-moodlog.dto';

@UseGuards(AuthGuard)
@Controller('mood-logs')
export class MoodLogsController {
  constructor(private moodLogsService: MoodLogsService) {}

  @Post()
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

    const canAccess = await this.moodLogsService.canAccessMoodLogs(loggedUser, userId);
    
    if (!canAccess) {
      throw new ForbiddenException('Você não tem permissão para acessar esses dados.');
    }

    return this.moodLogsService.getMoodLogs(userId);
  }
}
