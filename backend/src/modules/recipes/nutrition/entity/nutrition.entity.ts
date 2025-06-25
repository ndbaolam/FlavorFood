import 'reflect-metadata';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipes } from '../../entity/recipes.entity';

@Entity('nutritrion')
export class Nutritrion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,    
  })
  name: string;

  @Column({ type: 'double precision' })
  amount: number;

  @Column({
    type: 'varchar',
    nullable: true, // Optional field
    default: null, // Default value if not provided
  })
  unit: string;

  @ManyToOne(() => Recipes, (recipe) => recipe.ingredients, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  recipe: Recipes;
}
