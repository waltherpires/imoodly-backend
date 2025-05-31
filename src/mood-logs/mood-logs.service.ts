import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoodLog } from './mood-log.entity';
import { Repository } from 'typeorm';
import { MoodLogDto } from './dto/moodlog.dto';
import { plainToInstance } from 'class-transformer';
import { UsersService } from 'src/users/users.service';
import { LinkRequestsService } from 'src/link-requests/link-requests.service';
import { CreateMoodLogDto } from './dto/create-moodlog.dto';
import { MoodEmotion } from './mood-emotion.entity';
import { Emotion } from 'src/common/enums/enums';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/notification.entity';
@Injectable()
export class MoodLogsService {
  constructor(
    @InjectRepository(MoodLog) private logRepo: Repository<MoodLog>,
    @InjectRepository(MoodEmotion)
    private readonly emotionRepo: Repository<MoodEmotion>,
    private userService: UsersService,
    private linkService: LinkRequestsService,
    private notificationService: NotificationsService,
  ) {}

  async getMonthlyEmotionSummary(userId: number) {
    // todo: checar se usuario pode ver isso

    const data = await this.emotionRepo
      .createQueryBuilder('emotion')
      .leftJoin('emotion.moodLog', 'log')
      .where('log.userId = :userId', { userId })
      .select([
        `EXTRACT(YEAR FROM log.created_at) as year`,
        `TO_CHAR(log.created_at, 'Month') as month`,
        `SUM(CASE WHEN emotion.emotion = :feliz THEN 1 ELSE 0 END) as feliz`,
        `SUM(CASE WHEN emotion.emotion = :triste THEN 1 ELSE 0 END) as triste`,
        `SUM(CASE WHEN emotion.emotion = :irritado THEN 1 ELSE 0 END) as irritado`,
        `SUM(CASE WHEN emotion.emotion = :ansioso THEN 1 ELSE 0 END) as ansioso`,
        `SUM(CASE WHEN emotion.emotion = :calmo THEN 1 ELSE 0 END) as calmo`,
        `SUM(CASE WHEN emotion.emotion = :confuso THEN 1 ELSE 0 END) as confuso`,
      ])
      .setParameters({
        userId,
        feliz: Emotion.FELIZ,
        triste: Emotion.TRISTE,
        irritado: Emotion.IRRITADO,
        ansioso: Emotion.ANSIOSO,
        calmo: Emotion.CALMO,
        confuso: Emotion.CONFUSO,
      })
      .groupBy('year, month')
      .orderBy('year, month')
      .getRawMany();

    return data.map((item) => ({
      year: item.year,
      month: item.month,
      emotions: {
        [Emotion.FELIZ]: item.feliz,
        [Emotion.TRISTE]: item.triste,
        [Emotion.IRRITADO]: item.irritado,
        [Emotion.ANSIOSO]: item.ansioso,
        [Emotion.CALMO]: item.calmo,
        [Emotion.CONFUSO]: item.confuso,
      },
    }));
  }

  async createMoodLog(userId: number, createMoodLogDto: CreateMoodLogDto) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Usuário não existe');
    }

    const emotions = createMoodLogDto.emotions.map((emotion) =>
      this.emotionRepo.create({ emotion }),
    );

    const moodLog = this.logRepo.create({
      title: createMoodLogDto.title,
      description: createMoodLogDto.description,
      user,
      emotions,
    });

    await this.logRepo.save(moodLog);

    const linkedPsychologists =
      await this.linkService.getPsychologistLinkedToUser(userId);

    for (const psychologistId of linkedPsychologists) {
      await this.notificationService.createNotification({
        type: NotificationType.POST,
        senderId: String(userId),
        receiverId: String(psychologistId),
        resourceId: String(moodLog.id),
      });
    }

    return plainToInstance(MoodLogDto, moodLog);
  }

  async getMoodLogs(userId: number): Promise<MoodLogDto[]> {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Usuário não existe');
    }

    const moodLogs = await this.logRepo.find({
      where: { user: { id: userId } },
      relations: ['emotions'],
      order: { createdAt: 'DESC' },
    });

    return moodLogs.map((moodlog) =>
      plainToInstance(MoodLogDto, {
        title: moodlog.title,
        description: moodlog.description,
        createdAt: moodlog.createdAt,
        tags: moodlog.emotions.map((e) => e.emotion),
      }),
    );
  }

  async canAccessMoodLogs(
    loggedUser: any,
    targetUserId: number,
  ): Promise<boolean> {
    const targetUserIdNumber = Number(targetUserId);
    if (loggedUser.id === targetUserIdNumber) {
      return true;
    }

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
