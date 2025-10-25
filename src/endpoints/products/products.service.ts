import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { Pin } from 'src/entities/pin.entity';
import { Product } from 'src/entities/product.entity';
import { ProviderImage } from 'src/entities/provider-image.entity';
import { Provider } from 'src/entities/provider.entity';
import { Service } from 'src/entities/service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product) private productsRepo: Repository<Product>,
        @InjectRepository(Service) private serviceRepo: Repository<Service>,
        @InjectRepository(Pin) private pinsRepo: Repository<Pin>,
        @InjectRepository(Provider) private providerRepo : Repository<Provider>,
        @InjectRepository(ProviderImage) private providerImagesRepo: Repository<ProviderImage>,
    ) {}

    getProducts(providerId?: number) {
        if(providerId)
            return this.productsRepo.find({where: {provider: { id: providerId }}});
        else
            return this.productsRepo.find();
    }

    getServices(providerId: number) {
        if(providerId)
            return this.serviceRepo.find({where: {provider: { id: providerId }}});
        else
            return this.serviceRepo.find();
    }

    getPins(providerId: number) {
        if(providerId)
            return this.pinsRepo.find({where: {provider: { id: providerId }}});
        else
            return this.pinsRepo.find();
    }

    getProviders(type?: "RECHARGES" | "SERVICES" | "PINS") {
        if(type)
            return this.providerRepo.find({ where: { type } });
        else
            return this.providerRepo.find();
    }

    async getProviderImage(providerId: number): Promise<string> {
        // Buscar la imagen por el provider_id
        const providerImage = await this.providerImagesRepo.findOne({
            where: { provider: { id: providerId } }
        });

        if (!providerImage) {
            throw new NotFoundException(`Image for provider ${providerId} not found`);
        }

        // Construir la ruta absoluta al archivo usando el campo 'name'
        // Asumiendo que 'name' contiene el nombre del archivo (ej: "telcel.png")
        const assetsPath = path.join(process.cwd(), 'dist', providerImage.name);

        // Verificar que el archivo existe
        if (!fs.existsSync(assetsPath)) {
            throw new NotFoundException(`Image file not found: ${providerImage.name}`);
        }

        return assetsPath;
    }
}
