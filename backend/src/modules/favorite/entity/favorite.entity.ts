import 'reflect-metadata';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../../users/entity/users.entity';
import { Recipes } from '../../recipes/entity/recipes.entity';

@Entity('favorite')
export class Favorite {
  @PrimaryGeneratedColumn()
  favorite_id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  user_id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  recipe_id: number;

  @ManyToOne(() => Users, user => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Recipes, recipe => recipe.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipes;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
