import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UrlEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  destinyUrl: string;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  clickNumber: number;

  @Column()
  shortenedUrl: string;

  @Column()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
