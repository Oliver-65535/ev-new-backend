import { Test, TestingModule } from '@nestjs/testing';
import { SessionHistoryService } from './session-history.service';

describe('SessionHistoryService', () => {
  let service: SessionHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionHistoryService],
    }).compile();

    service = module.get<SessionHistoryService>(SessionHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
