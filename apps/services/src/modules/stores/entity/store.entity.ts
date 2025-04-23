import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Users as User }  from '../../users/entity/users.entity';
import { StoreIngredient } from './store_ingredient.entity';

@Entity()
export class Stores {
  @PrimaryGeneratedColumn()
  store_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  phone_number: string;

  @OneToOne(() => User, (user) => user.store)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => StoreIngredient, ingredient => ingredient.store) // One store to many ingredients
  ingredients: StoreIngredient[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}