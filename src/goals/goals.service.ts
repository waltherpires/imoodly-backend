import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal, GoalStatus } from './goal.entity';
import { DeepPartial, Not, Repository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal) private goalRepository: Repository<Goal>,
    private userService: UsersService,
  ) {}

  async createGoal(goalDto: CreateGoalDto, userId: number) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encotrado!');
    }

    const totalSteps = goalDto.totalSteps ?? 1;
    if (totalSteps <= 0) {
        throw new BadRequestException('O número de passos deve ser maior do que 0.');
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

    return newGoal;
  }

  async getGoals(userId: number, status?: GoalStatus) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encotrado!');
    }

    const validStatus = Object.values(GoalStatus);

    if (status && !validStatus.includes(status)) {
        throw new BadRequestException('Status inválido!')
    }

    const whereClause: any = { user: { id: userId} };

    if (status) {
        whereClause.status = status;
    }

    return this.goalRepository.find({
      where: whereClause,
      order: { createdAt: 'DESC' },
    });
  }

  async changeProgress(goalId: number, quantity: number = 1) {
    const goal = await this.getGoalById(goalId);

    goal.currentStep += quantity;

    if (goal.currentStep < 0) {
        goal.currentStep = 0;
    }

    if (goal.totalSteps && goal.currentStep > goal.totalSteps) {
        goal.currentStep = goal.totalSteps;
        goal.status = GoalStatus.COMPLETED;
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
        throw new NotFoundException("Não foi possível encontrar esta meta.")
    }

    return goal; 
  }
}
