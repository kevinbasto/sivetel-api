import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pin } from 'src/entities/pin.entity';
import { Product } from 'src/entities/product.entity';
import { Service } from 'src/entities/service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product) private productsRepo: Repository<Product>,
        @InjectRepository(Service) private serviceRepo: Repository<Service>,
        @InjectRepository(Pin) private pinRepo: Repository<Pin>,
    ) {}

    getProducts() {
        return this.productsRepo.find();
    }

    getServices() {
        return this.serviceRepo.find();
    }

    getPins() {
        return this.pinRepo.find();
    }
}
