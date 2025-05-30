import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GetGoalsQueryDto } from './dto/get-goals-query.dto';
import { ChangeProgressDto } from './dto/change-progress.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { GoalResponseDto } from './dto/goal-response.dto';

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
    getGoals(@Query() query: GetGoalsQueryDto, @Request() req) {
        const userId = req.user.id;

        return this.goalsService.getGoals(userId, query);
    }

    @Get('summary')
    getGoalsSummary(@Query() query: GetGoalsQueryDto, @Request() req){
        const userId = req.user.id;
        return this.goalsService.getGoalsSummary(userId, query);
    }


    @Serialize(GoalResponseDto)    
    @Patch(':id/progress')
    updateProgress(@Param('id', ParseIntPipe) goalId: number, @Body() body: ChangeProgressDto ) {
        return this.goalsService.changeProgress(goalId, body.quantity);
    }


    @Serialize(GoalResponseDto)
    @Patch(':id/complete')
    completeGoal(@Param('id', ParseIntPipe) goalId: number) {
        return this.goalsService.completeGoal(goalId);
    }
}
