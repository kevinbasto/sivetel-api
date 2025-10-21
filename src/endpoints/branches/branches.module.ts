import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from 'src/entities/branch.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Branch]), AuthModule],
  controllers: [BranchesController],
  providers: [BranchesService],
})
export class BranchesModule {}
