import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from 'src/entities/sale.entity';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/entities/product.entity'; 
import { Service } from 'src/entities/service.entity';
import { Pin } from 'src/entities/pin.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SalesService {
  account : string;
  username : string;
  password : string;
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Pin)
    private readonly pinRepository: Repository<Pin>,
    private configService: ConfigService
  ) {
    this.account = this.configService.get<string>('SIVETEL_NUMBER')!;
    this.username = this.configService.get<string>('SIVETEL_USUARIO')!;
    this.password = this.configService.get<string>('SIVETEL_PASSWORD')!;
  }

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    // Validar que el usuario existe
    const user = await this.userRepository.findOne({
      where: { id: createSaleDto.userId }
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${createSaleDto.userId} not found`);
    }

    // Validar que solo se proporcione uno: product, service o pin
    const itemsProvided = [
      createSaleDto.productId,
      createSaleDto.serviceId,
      createSaleDto.pinId
    ].filter(item => item !== undefined && item !== null).length;

    if (itemsProvided === 0) {
      throw new BadRequestException('Must provide at least one: productId, serviceId, or pinId');
    }
    if (itemsProvided > 1) {
      throw new BadRequestException('Can only provide one: productId, serviceId, or pinId');
    }

    const sale = this.saleRepository.create({
      user,
      amount: createSaleDto.amount,
      type: createSaleDto.type,
      status: createSaleDto.status || 'pending',
    });

    // Asignar producto, servicio o pin según corresponda
    if (createSaleDto.productId) {
      const product = await this.productRepository.findOne({
        where: { id: createSaleDto.productId }
      });
      if (!product) {
        throw new NotFoundException(`Product with ID ${createSaleDto.productId} not found`);
      }
      sale.product = product;
    }

    if (createSaleDto.serviceId) {
      const service = await this.serviceRepository.findOne({
        where: { id: createSaleDto.serviceId }
      });
      if (!service) {
        throw new NotFoundException(`Service with ID ${createSaleDto.serviceId} not found`);
      }
      sale.service = service;
    }

    if (createSaleDto.pinId) {
      const pin = await this.pinRepository.findOne({
        where: { id: createSaleDto.pinId }
      });
      if (!pin) {
        throw new NotFoundException(`Pin with ID ${createSaleDto.pinId} not found`);
      }
      sale.pin = pin;
    }

    return await this.saleRepository.save(sale);
  }

  async findAll(): Promise<Sale[]> {
    return await this.saleRepository.find({
      relations: ['user', 'product', 'service', 'pin'],
      order: { date: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['user', 'product', 'service', 'pin']
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return sale;
  }

  async update(id: number, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.findOne(id);

    // Si se actualiza el monto
    if (updateSaleDto.amount !== undefined) {
      sale.amount = updateSaleDto.amount;
    }

    // Si se actualiza el tipo
    if (updateSaleDto.type) {
      sale.type = updateSaleDto.type;
    }

    // Si se actualiza el estado
    if (updateSaleDto.status) {
      sale.status = updateSaleDto.status;
    }

    // Si se actualiza el usuario
    if (updateSaleDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: updateSaleDto.userId }
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${updateSaleDto.userId} not found`);
      }
      sale.user = user;
    }

    return await this.saleRepository.save(sale);
  }

  async remove(id: number): Promise<void> {
    const sale = await this.findOne(id);
    await this.saleRepository.remove(sale);
  }

  // Métodos adicionales útiles
  async findByUser(userId: number): Promise<Sale[]> {
    return await this.saleRepository.find({
      where: { user: { id: userId } },
      relations: ['product', 'service', 'pin'],
      order: { date: 'DESC' }
    });
  }

  async findByStatus(status: string): Promise<Sale[]> {
    return await this.saleRepository.find({
      where: { status },
      relations: ['user', 'product', 'service', 'pin'],
      order: { date: 'DESC' }
    });
  }

  async getTotalSales(): Promise<number> {
    const result = await this.saleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.amount)', 'total')
      .getRawOne();
    return parseFloat(result.total) || 0;
  }
}