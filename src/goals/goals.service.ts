import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal, GoalStatus } from './goal.entity';
import { Between, DeepPartial, In, Not, Repository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UsersService } from 'src/users/users.service';
import { GetGoalsQueryDto } from './dto/get-goals-query.dto';
import { LinkRequestsService } from 'src/link-requests/link-requests.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/notification.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal) private goalRepository: Repository<Goal>,
    private userService: UsersService,
    private linkService: LinkRequestsService,
    private notificationService: NotificationsService,
  ) {}

  async createGoal(goalDto: CreateGoalDto, userId: number) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encotrado!');
    }

    const totalSteps = goalDto.totalSteps ?? 1;
    if (totalSteps <= 0) {
      throw new BadRequestException(
        'O número de passos deve ser maior do que 0.',
      );
    }

    const newGoal = this.goalRepository.create({
      title: goalDto.title,
      description: goalDto.description,
      totalSteps: Number(totalSteps),
      currentStep: 0,
      dueDate: goalDto.dueDate ? new Date(goalDto.dueDate) : null,
      status: goalDto.totalSteps ? GoalStatus.IN_PROGRESS : GoalStatus.PENDING,
      user: user,
    } as DeepPartial<Goal>);

    await this.goalRepository.save(newGoal);

    const linkedPsychologist =
      await this.linkService.getPsychologistLinkedToUser(userId);

    for (const psychologistId of linkedPsychologist) {
      await this.notificationService.createNotification({
        type: NotificationType.GOAL,
        senderId: String(userId),
        receiverId: String(psychologistId),
        resourceId: String(newGoal.id),
      });
    }

    return newGoal;
  }

  async getGoals(userId: number, query: GetGoalsQueryDto) {
    const { status, month, year } = query;
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encotrado!');
    }

    const whereClause: any = { user: { id: userId } };
    if (status && status.length) {
      whereClause.status = In(status);
    }

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      whereClause.createdAt = Between(startDate, endDate);
    }

    return this.goalRepository.find({
      where: whereClause,
      order: { createdAt: 'DESC' },
    });
  }

  async getGoalsSummary(userId: number, query: GetGoalsQueryDto) {
    const { month, year } = query;
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const whereClause: any = { user: { id: userId } };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      whereClause.createdAt = Between(startDate, endDate);
    }
    const totalGoals = await this.goalRepository.count({
      where: whereClause,
      relations: ['user'],
    });

    const completedGoals = await this.goalRepository.count({
      where: { ...whereClause, status: GoalStatus.COMPLETED },
      relations: ['user'],
    });

    return { totalGoals, completedGoals };
  }

  async completeGoal(goalId: number) {
    const goal = await this.getGoalById(goalId);

    if (goal.totalSteps !== goal.currentStep) {
      throw new BadRequestException('Não é possível completar a tarefa.');
    }

    goal.status = GoalStatus.COMPLETED;

    return this.goalRepository.save(goal);
  }

  async changeProgress(goalId: number, quantity: number = 1) {
    const goal = await this.getGoalById(goalId);

    goal.currentStep += quantity;

    if (goal.currentStep < 0) {
      goal.currentStep = 0;
    }

    if (goal.totalSteps && goal.currentStep > goal.totalSteps) {
      goal.currentStep = goal.totalSteps;
    } else if (goal.currentStep === 0) {
      goal.status = GoalStatus.PENDING;
    } else {
      goal.status = GoalStatus.IN_PROGRESS;
    }

    return this.goalRepository.save(goal);
  }

  async getGoalById(goalId: number) {
    const goal = await this.goalRepository.findOne({ where: { id: goalId } });

    if (!goal) {
      throw new NotFoundException('Não foi possível encontrar esta meta.');
    }

    return goal;
  }

  async canAccessGoals(
    loggedUser: any,
    targetUserId: number,
  ): Promise<boolean> {
    if (loggedUser.id === targetUserId) return true;

    if (loggedUser.role === 'psicologo') {
      const hasLink = await this.linkService.hasAcceptedLinkBetween(
        loggedUser.id,
        targetUserId,
      );
      if (hasLink) return true;
    }

    return false;
  }
}
