import { Test, TestingModule } from '@nestjs/testing';
import { MatchsHistoryController } from './matchs-history.controller';
import { MatchsHistoryService } from './matchs-history.service';

describe('MatchsHistoryController', () => {
  let controller: MatchsHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchsHistoryController],
      providers: [MatchsHistoryService],
    }).compile();

    controller = module.get<MatchsHistoryController>(MatchsHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
