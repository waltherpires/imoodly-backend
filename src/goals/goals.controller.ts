import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GetGoalsQueryDto } from './dto/get-goals-query.dto';
import { ChangeProgressDto } from './dto/change-progress.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { GoalResponseDto } from './dto/goal-response.dto';

@UseGuards(AuthGuard)
@Serialize(GoalResponseDto)
@Controller('goals')
export class GoalsController {
    constructor(private goalsService: GoalsService) {}

    @Post()
    async createGoal(@Request() req, @Body() body: CreateGoalDto) {
        const userId = req.user.id;

        return this.goalsService.createGoal(body, userId);
    }

    @Get()
    getGoals(@Query() query: GetGoalsQueryDto, @Request() req) {
        const userId = req.user.id;

        return this.goalsService.getGoals(userId, query.status);
    }

    @Patch(':id/progress')
    updateProgress(@Param('id', ParseIntPipe) goalId: number, @Body() body: ChangeProgressDto ) {
        return this.goalsService.changeProgress(goalId, body.quantity);
    }
}
