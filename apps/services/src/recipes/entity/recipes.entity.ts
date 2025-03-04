import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Favorite } from '../../favorite/entity/favorite.entity';
import { Categories } from '../../categories/entity/categories.entity';
import { Review } from '../../review/entity/review.entity';

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
    unique: true,
  })
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: DifficultyLevel,
    default: DifficultyLevel.MEDIUM,
  })
  difficulty_level: DifficultyLevel;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  time: Date;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  image_detail: string;

  @Column()
  serving: number;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column('text')
  step: string;

  @Column('text')
  nutrition: string;

  // One Recipe can be favorited many times
  @OneToMany(() => Favorite, (favorite) => favorite.recipe)
  favorites: Favorite[];

  @OneToMany(() => Review, (review) => review.recipe)
  reviews: Review[];

  @ManyToMany(() => Categories, (categories) => categories.recipes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
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
