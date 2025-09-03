import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { UsersModule } from 'src/users/users.module';
import { LinkRequestsModule } from 'src/link-requests/link-requests.module';
import { Goal } from 'src/goals/goal.entity';
import { MoodLog } from 'src/mood-logs/mood-log.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Comment, Goal, MoodLog]),
    UsersModule,
    LinkRequestsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
