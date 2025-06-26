import 'reflect-metadata';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';
import { Favorite } from '../../favorite/entity/favorite.entity';
import { Categories } from '../../categories/entity/categories.entity';
import { Review } from '../../review/entity/review.entity';
import { Ingredient } from '../ingredient/entity/ingredient.entity';
import { Nutritrion } from '../nutrition/entity/nutrition.entity';
import { Steps } from '../steps/entity/step.entity';

export enum DifficultyLevel {
  EASY = 'Dễ',
  MEDIUM = 'Trung bình',
  HARD = 'Khó',
}

@Entity('recipes')
export class Recipes {
  @PrimaryGeneratedColumn()
  recipe_id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: DifficultyLevel,
    default: DifficultyLevel.MEDIUM,
  })
  difficulty_level: DifficultyLevel;

  @Column({
    type: 'int',
    nullable: true,
  })
  time: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  image: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  image_detail: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  serving: number;

  // One Recipe can be favorited many times
  @OneToMany(() => Favorite, (favorite) => favorite.recipe)
  favorites: Favorite[];

  @OneToMany(() => Review, (review) => review.recipe)
  reviews: Review[];

  @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe, {
    cascade: true,
  })
  ingredients: Ingredient[];

  @OneToMany(() => Nutritrion, (nutrition) => nutrition.recipe, {
    cascade: true,
  })
  nutrition: Nutritrion[];

  @OneToMany(() => Steps, (step) => step.recipe, { cascade: true })
  steps: Steps[];

  @ManyToMany(() => Categories, (categories) => categories.recipes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'recipe_categories',
    joinColumn: {
      name: 'recipe_id',
      referencedColumnName: 'recipe_id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'category_id',
    },
  })
  categories: Categories[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
