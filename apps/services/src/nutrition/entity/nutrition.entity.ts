import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipes } from '../../recipes/entity/recipes.entity';

@Entity('nutritrion')
export class Nutritrion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'double precision' })
  amount: number;

  @Column()
  unit: string;

  @ManyToOne(() => Recipes, (recipe) => recipe.ingredients, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  recipe: Recipes;
}
