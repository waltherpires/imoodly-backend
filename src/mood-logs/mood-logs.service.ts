import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoodLog } from './mood-log.entity';
import { Repository } from 'typeorm';
import { MoodLogDto } from './dto/mood-log-dto';
import { plainToInstance } from 'class-transformer';
import { UsersService } from 'src/users/users.service';
import { LinkRequestsService } from 'src/link-requests/link-requests.service';

@Injectable()
export class MoodLogsService {
  constructor(@InjectRepository(MoodLog) private repo: Repository<MoodLog>, private userService: UsersService, private linkService: LinkRequestsService) {}

  async getMoodLogs(userId: number): Promise<MoodLogDto[]> {
    const user = await this.userService.findOne(userId);

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

  async canAccessMoodLogs(loggedUser: any, targetUserId: number): Promise<boolean> {
    if (loggedUser.id === targetUserId) {
      return true;
    }

    if(loggedUser.role === 'psicologo'){
      const hasLink = await this.linkService.hasAcceptedLinkBetween(loggedUser.id, targetUserId);
      if (hasLink) return true;
    }

    return false;
  }
}
