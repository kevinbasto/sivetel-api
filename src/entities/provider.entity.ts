import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { Pin } from "./pin.entity";
import { Service } from "./service.entity";
import { ProviderImage } from "./provider-image.entity";

@Entity('providers')
export class Provider {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    type: string;

    @OneToMany(() => Product, (product) => product.provider)
    products: Product[];

    @OneToOne(() => ProviderImage, (providerImage) => providerImage.provider)
    providerImage: ProviderImage;

    @OneToMany(() => Pin, (pin) => pin.provider)
    pins: Pin[];

    @OneToMany(() => Service, (service) => service.provider)
    services: Service[];
}