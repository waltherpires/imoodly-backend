import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    async createComment(
        @Request() req, @Body() body: CreateCommentDto
    ) {
        const loggedUser = req.user;
        return this.commentsService.createComment(loggedUser.id, body);
    }
}
