import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Pin } from "./pin.entity";
import { Product } from "./product.entity";
import { Service } from "./service.entity";
import { User } from "./user.entity";

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    transactionId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    charge: number;

    @Column({ type: 'varchar', length: 50 })
    type: string; // recharge, pin, service

    @CreateDateColumn({ type: 'timestamp' })
    date: Date;

    @Column({ type: 'varchar', length: 50, default: 'pending' })
    status: string;  // pending, rejected, accepted

    @ManyToOne(() => User, { eager: false, nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Product, { eager: false, nullable: true })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Service, { eager: false, nullable: true })
    @JoinColumn({ name: 'service_id' })
    service: Service;

    @ManyToOne(() => Pin, { eager: false, nullable: true })
    @JoinColumn({ name: 'pin_id' })
    pin: Pin;
}