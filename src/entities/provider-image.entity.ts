import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Provider } from "./provider.entity";

@Entity('provider_images')
export class ProviderImage{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @OneToOne(() => Provider, (provider) => provider.providerImage, { eager: true }) // eager: true carga automáticamente
    @JoinColumn({ name: 'provider_id' })
    provider: Provider;
}