import { Test, TestingModule } from '@nestjs/testing';
import { MoodLogsController } from './mood-logs.controller';

describe('MoodLogsController', () => {
  let controller: MoodLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoodLogsController],
    }).compile();

    controller = module.get<MoodLogsController>(MoodLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
