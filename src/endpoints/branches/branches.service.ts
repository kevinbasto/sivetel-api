import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from 'src/entities/branch.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BranchesService {

  constructor(
    @InjectRepository(Branch) private branchRepository: Repository<Branch>
  ) { }

  create(createBranchDto: CreateBranchDto) {
    let branch: Partial<Branch> = { ...createBranchDto };
    branch.createdAt = new Date();
    branch.updatedAt = new Date();
    return this.branchRepository.save(branch);
  }

  async findAll(status: string = 'ACTIVE'): Promise<Partial<Branch>[]> {
    let condition = status == 'ACTIVE' ? { inactive: false } : status == 'ALL' ? {} : { inactive: true }
    const branches = await this.branchRepository.find({ where: condition });
    return branches.map(({  ...rest }) => rest);
  }

  findOne(id: number) {
    return this.branchRepository.findOne({ where: {id} });
  }

  update(id: number, updateBranchDto: UpdateBranchDto) {
    return this.branchRepository.update({ id }, updateBranchDto);
  }

  async remove(id: number) {
    await this.branchRepository.update({ id }, { inactive: true });
    return { message: "Sucursal dada de baja" }
  }
}
