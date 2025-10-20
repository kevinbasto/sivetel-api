import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password } = createUserDto;
      const encryptedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      createUserDto.password = encryptedPassword;

      await this.usersRepo.save(createUserDto)
        .catch(error => { throw new InternalServerErrorException(error) });

      return { message: "User created successfully" };
    } catch (error) {
      throw error;
    }
  }

  async findAll(status : string  = 'ACTIVE'): Promise<Partial<User>[]> {
    let condition = status == 'ACTIVE'? { inactive: false } : status == 'ALL'? {} : { inactive: true }
    const users = await this.usersRepo.find({ where: condition });
    return users.map(({ password, ...rest }) => rest);
  }

  async findOne(id: number) {
    try {
      const user: Partial<User> | null = await this.usersRepo.findOne({ 
        where: { id },
        relations: ['branch']
      });
      if (!user) throw new NotFoundException(`User with id ${id} not found`);
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersRepo.findOne({ where: { id } });
      if (!user) throw new NotFoundException(`User with id ${id} not found`);

      if (user.id == 1 && updateUserDto.inactive) {
        throw new BadRequestException(`User with id 1 cannot be deactivated`)
      }

      if (updateUserDto.password) {
        updateUserDto.password = bcrypt.hashSync(updateUserDto.password, bcrypt.genSaltSync(10));
      }

      const updatedUser: Partial<User> = await this.usersRepo.save({ ...user, ...updateUserDto });
      delete updatedUser.password;
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      // Restricción: usuario con id 1 es indeleble
      if (id == 1) {
        throw new Error(`El usuario con id 1 no puede ser inactivado`);
      }

      const user = await this.usersRepo.findOne({ where: { id, inactive: false } });
      if (!user) throw new NotFoundException(`User with id ${id} not found`);

      user.inactive = true;
      await this.usersRepo.save(user); // soft delete
      return { message: `User with id ${id} marked as inactive` };
    } catch (error) {
      throw error;
    }
  }

}

