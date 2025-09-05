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

    let entityOwnerId: number;
    let entityType = createCommentDto.entityType;
    let entityId = createCommentDto.entityId;
    if (createCommentDto.parentId) {
      const parent = await this.commentRepo.findOne({
        where: { id: createCommentDto.parentId },
        relations: ['user'],
      });

      if (!parent) {
        throw new NotFoundException('Comentário principal não foi encontrado');
      }

      entityOwnerId = parent.user.id;
      entityType = parent.entityType;
      entityId = parent.entityId;

      const reply = this.commentRepo.create({
        content: createCommentDto.content,
        user,
        parent,
        entityType,
        entityId,
      });

      return this.commentRepo.save(reply);
    } else {
      if (entityType === EntityType.POST) {
        const post = await this.moodLogRepo.findOne({
          where: { id: entityId },
          relations: ['user'],
        });
        if (!post) throw new NotFoundException('Postagem não foi encontrada!');
        entityOwnerId = post.user.id;
      } else if (entityType === EntityType.GOAL) {
        const goal = await this.goalRepo.findOne({
          where: { id: entityId },
          relations: ['user'],
        });
        if (!goal) throw new NotFoundException('Meta não foi encontrada!');
        entityOwnerId = goal.user.id;
      } else {
        throw new BadRequestException(
          'Tipo de entidade inválido para comentário!',
        );
      }

      const hasLink = await this.linkService.hasAcceptedLinkBetween(
        userId,
        entityOwnerId,
      );

      if (!hasLink)
        throw new ForbiddenException(
          'Você não tem permissão para comentar aqui',
        );

      const comment = this.commentRepo.create({
        entityId: Number(createCommentDto.entityId),
        entityType: createCommentDto.entityType,
        content: createCommentDto.content,
        user: user,
      });

      return this.commentRepo.save(comment);
    }
  }

  async getEntityComments(entityId: number): Promise<Comment[]> {
    const where: any = { entityId: entityId, parent: null };

    return this.commentRepo.find({
      where,
      relations: ['replies', 'user', 'replies.user'],
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
