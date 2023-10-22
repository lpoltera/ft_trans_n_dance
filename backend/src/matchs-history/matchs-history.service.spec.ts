import { Test, TestingModule } from '@nestjs/testing';
import { MatchsHistoryService } from './matchs-history.service';

describe('MatchsHistoryService', () => {
  let service: MatchsHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchsHistoryService],
    }).compile();

    service = module.get<MatchsHistoryService>(MatchsHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
