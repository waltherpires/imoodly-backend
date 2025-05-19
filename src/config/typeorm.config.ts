import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const env = this.configService.get<string>('NODE_ENV');

    if (env === 'production') {
      return {
        type: 'postgres',
        url: this.configService.get<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        autoLoadEntities: true,
        synchronize: false,
      };
    } else if (env === 'local') {
      return {
        type: 'postgres',
        url: this.configService.get<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        autoLoadEntities: true,
        synchronize: true,
      };
    } else {
      return {
        type: 'postgres',
        host: this.configService.get<string>('DATABASE_HOST'),
        port: Number(this.configService.get<number>('DATABASE_PORT')),
        username: this.configService.get<string>('DATABASE_USER'),
        password: this.configService.get<string>('DATABASE_PASSWORD'),
        database: this.configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        migrationsRun: env === 'test',
      };
    }
  }
}
