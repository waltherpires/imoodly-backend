import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from './goal.entity';
import { DeepPartial, Not, Repository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal-dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoalsService {
    constructor(@InjectRepository(Goal) private goalRepository: Repository<Goal>, private userService: UsersService) {}

    async createGoal(goalDto: CreateGoalDto, userId: number) {
        const user = await this.userService.findOne(userId);

        if (!user) {
            throw new NotFoundException('Usuário não encotrado!');
        }

        const newGoal = this.goalRepository.create({
            title: goalDto.title,
            description: goalDto.description,
            totalSteps: goalDto.totalSteps ? Number(goalDto.totalSteps) : null,
            currentStep: 0,
            dueDate: goalDto.dueDate ? new Date(goalDto.dueDate) : null,
            status: goalDto.totalSteps ? 'in-progress' : 'pending',
            user: user,
        } as DeepPartial<Goal>);

        await this.goalRepository.save(newGoal);

        return newGoal;
    } 

    async getPendingGoals(userId: number) {
        const user = await this.userService.findOne(userId);

        if (!user) {
            throw new NotFoundException('Usuário não encotrado!');
        }

        return this.goalRepository.find({ 
            where: { user: { id: userId }, status: Not('completed') },
            order: { createdAt: 'DESC' },
        })
    }

        async getCompletedGoals(userId: number) {
        const user = await this.userService.findOne(userId);

        if (!user) {
            throw new NotFoundException('Usuário não encotrado!');
        }

        return this.goalRepository.find({ 
            where: { user: { id: userId }, status: 'completed' },
            order: { createdAt: 'DESC' },
        })
    }
}
