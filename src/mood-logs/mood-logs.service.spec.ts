import { Test, TestingModule } from '@nestjs/testing';
import { MoodLogsService } from './mood-logs.service';

describe('MoodLogsService', () => {
  let service: MoodLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoodLogsService],
    }).compile();

    service = module.get<MoodLogsService>(MoodLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
