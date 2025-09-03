import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment, EntityType } from './comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersService } from 'src/users/users.service';
import { LinkRequestsService } from 'src/link-requests/link-requests.service';
import { MoodLog } from 'src/mood-logs/mood-log.entity';
import { Goal } from 'src/goals/goal.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly userService: UsersService,
    private readonly linkService: LinkRequestsService,
    @InjectRepository(MoodLog)
    private readonly moodLogRepo: Repository<MoodLog>,
    @InjectRepository(Goal)
    private readonly goalRepo: Repository<Goal>,
  ) {}

  async createComment(
    userId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Usuário não existe');
    }

    let ownerId: number;
    if (createCommentDto.entityType === EntityType.POST) {
      const post = await this.moodLogRepo.findOne({
        where: { id: Number(createCommentDto.entityId) },
        relations: ['user'],
      });
      if (!post) throw new NotFoundException('Postagem não foi encontrada!');
      ownerId = post.user.id;
    } else if (createCommentDto.entityType === EntityType.GOAL) {
      const goal = await this.goalRepo.findOne({
        where: { id: Number(createCommentDto.entityId) },
        relations: ['user'],
      });
      if (!goal) throw new NotFoundException('Meta não foi encontrada!');
      ownerId = goal.user.id;
    } else {
      throw new BadRequestException(
        'Tipo de entidade inválido para comentário!',
      );
    }

    const hasLink = await this.linkService.hasAcceptedLinkBetween(
      userId,
      ownerId,
    );

    if (!hasLink)
      throw new ForbiddenException('Você não tem permissão para comentar aqui');

    const comment = this.commentRepo.create({
      entityId: Number(createCommentDto.entityId),
      entityType: createCommentDto.entityType,
      content: createCommentDto.content,
      user: user,
    });

    return this.commentRepo.save(comment);
  }

  async getEntityComments(entityId: number): Promise<Comment[]> {
    const where: any = { entityId: entityId };

    return this.commentRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(commentId: number): Promise<Comment> {
    const comment = await this.commentRepo.findOneByOrFail({
      id: commentId,
    });
    comment.isRead = true;
    return this.commentRepo.save(comment);
  }
}
