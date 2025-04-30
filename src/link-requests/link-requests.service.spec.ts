import { Test, TestingModule } from '@nestjs/testing';
import { LinkRequestsService } from './link-requests.service';

describe('LinkRequestsService', () => {
  let service: LinkRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkRequestsService],
    }).compile();

    service = module.get<LinkRequestsService>(LinkRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
