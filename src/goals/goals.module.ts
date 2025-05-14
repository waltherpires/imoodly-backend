import { Module } from '@nestjs/common';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [UsersService],
  controllers: [GoalsController],
  providers: [GoalsService]
})
export class GoalsModule {}
