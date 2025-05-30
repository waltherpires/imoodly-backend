import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PsychologistService } from './psychologist.service';
import { Psychologist } from './psychologist.entity';
import { LinkRequestsModule } from 'src/link-requests/link-requests.module';

@Module({
  imports: [LinkRequestsModule ,AuthModule, TypeOrmModule.forFeature([User, Psychologist])],
  controllers: [UsersController],
  providers: [UsersService, PsychologistService],
  exports: [UsersService, PsychologistService]
})
export class UsersModule {}
