import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Users as User } from '../../users/entity/users.entity';
import { StoreIngredient } from './store_ingredient.entity';

@Entity()
export class Stores {
  @PrimaryGeneratedColumn()
  store_id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  image: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({ nullable: true, type: 'varchar' })
  address: string;

  @Column({ nullable: true, type: 'double precision' })
  longitude: number;
  
  @Column({ nullable: true, type: 'double precision' })
  latitude: number;
  
  @Column({
    nullable: true,
    type: 'enum',
    enum: ['active', 'inactive', 'closed'],
    default: 'active',
  })
  status: 'active' | 'inactive' | 'closed';

  @Column({ nullable: true, type: 'varchar' })
  phone_number: string;

  @Column({ nullable: true, type: 'timestamptz' })
  openHours: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  closeHours: Date;

  @OneToOne(() => User, (user) => user.store)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => StoreIngredient, (ingredient) => ingredient.store)
  ingredients: StoreIngredient[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
