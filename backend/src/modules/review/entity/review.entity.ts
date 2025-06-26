import 'reflect-metadata';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { Users } from '../../users/entity/users.entity';
import { Recipes } from '../../recipes/entity/recipes.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

  @ManyToOne(() => Users, (user) => user.reviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: Users;

  @ManyToOne(() => Recipes, (recipe) => recipe.reviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  recipe: Recipes;

  @Column({ type: 'int', width: 1 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
