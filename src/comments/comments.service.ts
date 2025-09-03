import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private userService: UsersService,
  ) {}

  async createComment(
    userId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Usuário não existe');
    }

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
