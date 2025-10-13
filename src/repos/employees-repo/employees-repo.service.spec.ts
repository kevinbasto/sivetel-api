import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesRepoService } from './employees-repo.service';

describe('EmployeesRepoService', () => {
  let service: EmployeesRepoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeesRepoService],
    }).compile();

    service = module.get<EmployeesRepoService>(EmployeesRepoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
