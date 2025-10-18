import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RechargeSaleDTo } from './dto/rechage-sale.dto';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SalesService {
  
  account : string;
  username : string;
  password : string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {
    this.account = this.configService.get<string>('SIVETEL_NUMBER')!;
    this.username = this.configService.get<string>('SIVETEL_USUARIO')!;
    this.password = this.configService.get<string>('SIVETEL_PASSWORD')!;
  }

  createRecharge(rechargeSaleDate: RechargeSaleDTo) {
    
  }
  
}