import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Sale } from "./sale.entity";
import { Branch } from "./branch.entity";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column({ default: false })
    inactive: boolean; // marca soft delete

    @Column({ default: false })
    isAdmin: boolean; // privilegios administrativos

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Sale, (sale) => sale.user)
    sales: Sale[]

    @ManyToOne(() => Branch, (branch) => branch.users)
    @JoinColumn({name: 'branch_id'})
    branch: Branch;
}
