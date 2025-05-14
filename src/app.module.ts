import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodLogsModule } from './mood-logs/mood-logs.module';
import { AuthModule } from './auth/auth.module';
import { LinkRequestsModule } from './link-requests/link-requests.module';
import { GoalsModule } from './goals/goals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: { rejectUnauthorized: false},
    }),
    UsersModule,
    MoodLogsModule,
    AuthModule,
    LinkRequestsModule,
    GoalsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
