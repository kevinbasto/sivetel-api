import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product) private productsRepo: Repository<Product>
    ) {}

    getProducts() {
        return this.productsRepo.find();
    }
}
