import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoodLog } from './mood-log.entity';
import { Repository } from 'typeorm';
import { MoodLogDto } from './dto/mood-log-dto';
import { plainToInstance } from 'class-transformer';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MoodLogsService {
  constructor(@InjectRepository(MoodLog) private repo: Repository<MoodLog>, private userService: UsersService) {}

  async getMoodLogs(userId: number): Promise<MoodLogDto[]> {
    const user = this.userService.findOne(userId);

    if (!user) {
        throw new NotFoundException('Usuário não existe');
    }

    const moodLogs = await this.repo.find({
        where: { user: { id: userId } },
        relations: ['emotions'],
    })

    return moodLogs.map((moodlog) =>
        plainToInstance(MoodLogDto, {
            title: moodlog.title,
            description: moodlog.description,
            createdAt: moodlog.createdAt,
            tags: moodlog.emotions.map((e) => e.emotion),
        })
    );
  }
}
