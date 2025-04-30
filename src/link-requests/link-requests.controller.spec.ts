import { Test, TestingModule } from '@nestjs/testing';
import { LinkRequestsController } from './link-requests.controller';

describe('LinkRequestsController', () => {
  let controller: LinkRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkRequestsController],
    }).compile();

    controller = module.get<LinkRequestsController>(LinkRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
