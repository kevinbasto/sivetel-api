import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ TypeOrmModule.forFeature([User]), AuthModule ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
