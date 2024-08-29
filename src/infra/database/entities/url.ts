import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user";

@Entity()
export class UrlEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column("string")
    destinyUrl: string;

    @Column("string")
    userId?: string;

    @OneToMany()
    user?: UserEntity;

    @Column("int")
    clickNumber: number;

    @Column("string")
    shortenedUrl: string;

    @Column("date")
    createdAt: Date;

    @UpdateDateColumn("date")
    updatedAt?: Date;

    @DeleteDateColumn("date")
    deletedAt?: Date;
}