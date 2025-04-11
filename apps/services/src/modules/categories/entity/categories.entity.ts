import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Recipes } from '../../recipes/entity/recipes.entity';

@Entity('categories')
export class Categories {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  category_id: number;

  @Column({    
    nullable: false
  })
  title: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
  
  @ManyToMany(() => Recipes, (recipe) => recipe.categories, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinTable({
    name: 'recipe_categories',
    joinColumn: {
      name: 'category_id',
      referencedColumnName: 'category_id',
    },
    inverseJoinColumn: {
      name: 'recipe_id',
      referencedColumnName: 'recipe_id',
    },
  })
  recipes: Recipes[];
}
