import { Test, TestingModule } from '@nestjs/testing';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';

describe('PollsService', () => {
  let service: PollsService;
  let controller: PollsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollsController],
      providers: [PollsService],
    }).compile();

    service = module.get<PollsService>(PollsService);
    controller = module.get<PollsController>(PollsController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
