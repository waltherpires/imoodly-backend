import { Module } from '@nestjs/common';
import { LinkRequestsController } from './link-requests.controller';
import { LinkRequestsService } from './link-requests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { LinkRequest } from './link-request.entity';
import { AuthModule } from 'src/auth/auth.module';
import { IsPsychologistOfGuard } from './is-psychologist-of.guard';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([LinkRequest, User])],
  controllers: [LinkRequestsController],
  providers: [LinkRequestsService, IsPsychologistOfGuard],
  exports: [LinkRequestsService, IsPsychologistOfGuard],
})
export class LinkRequestsModule {}
