import { Module } from '@nestjs/common';
import { PeopleRepoService } from './people-repo/people-repo.service';
import { EmployeesRepoService } from './employees-repo/employees-repo.service';

@Module({
  providers: [PeopleRepoService, EmployeesRepoService]
})
export class ReposModule {}
