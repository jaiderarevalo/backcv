import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('skills')
export class Skill {
    @PrimaryGeneratedColumn('uuid')
    id:string
    @Column()
    skill: string
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updateAt: Date;
    @DeleteDateColumn()
    deleteAt: Date;
}
