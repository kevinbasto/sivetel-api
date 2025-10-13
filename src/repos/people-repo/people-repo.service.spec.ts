import { Test, TestingModule } from '@nestjs/testing';
import { PeopleRepoService } from './people-repo.service';

describe('PeopleRepoService', () => {
  let service: PeopleRepoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeopleRepoService],
    }).compile();

    service = module.get<PeopleRepoService>(PeopleRepoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
