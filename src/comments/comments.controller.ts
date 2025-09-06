import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { EntityType } from './comment.entity';

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment(@Request() req, @Body() body: CreateCommentDto) {
    const loggedUser = req.user;
    return this.commentsService.createComment(loggedUser.id, body);
  }

  @Get()
  async getComments(
    @Query('entityId') entityId: string,
    @Query('entityType') entityType: EntityType
  ) {
    return this.commentsService.getEntityComments(Number(entityId), entityType);
  }
}
