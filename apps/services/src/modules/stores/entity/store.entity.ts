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

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true, type: 'double precision' })
  longitude: number;
  
  @Column({ nullable: true, type: 'double precision' })
  latitude: number;
  

  @Column({ nullable: true })
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
