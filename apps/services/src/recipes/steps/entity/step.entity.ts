import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipes } from "../../entity/recipes.entity";

@Entity('steps')
export class Steps {
  @PrimaryGeneratedColumn()
  id: number  

  @Column()
  number: number

  @Column('text')
  step: string

  @ManyToOne(() => Recipes, (recipe) => recipe.steps, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  recipe: Recipes;
}