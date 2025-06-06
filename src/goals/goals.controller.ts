import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GetGoalsQueryDto } from './dto/get-goals-query.dto';
import { ChangeProgressDto } from './dto/change-progress.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { GoalResponseDto } from './dto/goal-response.dto';
import { UserRole } from 'src/common/enums/enums';

@UseGuards(AuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Serialize(GoalResponseDto)
  @Post()
  async createGoal(@Request() req, @Body() body: CreateGoalDto) {
    const userId = req.user.id;

    return this.goalsService.createGoal(body, userId);
  }

  @Serialize(GoalResponseDto)
  @Get()
  async getGoals(@Query() query: GetGoalsQueryDto, @Request() req) {
    const loggedUser = req.user;
    const loggedUserId = req.user.id;
    const isPsychologist = req.user.role === UserRole.PSICOLOGO;
    const { userId: patientId } = query;

    if (patientId) {
      const canAccess = await this.goalsService.canAccessGoals(
        loggedUser,
        patientId,
      );

      if (!canAccess) {
        throw new ForbiddenException(
          'Você não tem permissão para acessar esses dados.',
        );
      }
    }

    const targetUserId = isPsychologist && patientId ? patientId : loggedUserId;

    return this.goalsService.getGoals(targetUserId, query);
  }

  @Get('summary/:userId')
  async getGoalsSummary(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: GetGoalsQueryDto,
    @Request() req,
  ) {
    const loggedUser = req.user;

    const canAccess = await this.goalsService.canAccessGoals(
      loggedUser,
      userId,
    );
    if (!canAccess) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esses dados.',
      );
    }

    return this.goalsService.getGoalsSummary(userId, query);
  }

  @Serialize(GoalResponseDto)
  @Patch(':id/progress')
  updateProgress(
    @Param('id', ParseIntPipe) goalId: number,
    @Body() body: ChangeProgressDto,
  ) {
    return this.goalsService.changeProgress(goalId, body.quantity);
  }

  @Serialize(GoalResponseDto)
  @Patch(':id/complete')
  completeGoal(@Param('id', ParseIntPipe) goalId: number) {
    return this.goalsService.completeGoal(goalId);
  }
}
