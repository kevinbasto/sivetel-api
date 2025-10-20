import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('branches')
export class Branch {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    address: string;
    @Column()
    city: string; 
    @Column()
    createdAt: Date;
    @Column()
    updatedAt: Date;
    @Column()
    inactive: boolean;
    @OneToMany(() => User, (user) => user.branch)
    users: User[];
}