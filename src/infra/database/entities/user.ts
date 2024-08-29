import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('string')
  name: string;

  @Column('string')
  email: string;

  @Column('string')
  password_hash: string;

  @Column('date')
  createdAt: Date;

  @UpdateDateColumn('date')
  updatedAt?: Date;

  @DeleteDateColumn('date')
  deletedAt?: Date;
}
