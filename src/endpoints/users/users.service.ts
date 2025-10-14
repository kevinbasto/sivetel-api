import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password } = createUserDto;
      const encryptedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      createUserDto.password = encryptedPassword;
      await this.usersRepo.save(createUserDto)
      .catch(error => { throw new InternalServerErrorException(error) });
      return { message: "User created successfully" }
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      let users: Array<Partial<User>> = await this.usersRepo.find();
      let sanitized = users.map(user => {delete user.password; return user});
      return sanitized;
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
