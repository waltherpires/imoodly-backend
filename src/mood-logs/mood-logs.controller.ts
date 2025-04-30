import { Controller, ForbiddenException, Get, Param, Request, UseGuards } from '@nestjs/common';
import { MoodLogsService } from './mood-logs.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('mood-logs')
export class MoodLogsController {
  constructor(private moodLogsService: MoodLogsService) {}

  @UseGuards(AuthGuard)
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
