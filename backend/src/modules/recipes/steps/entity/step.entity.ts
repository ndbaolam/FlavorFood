import 'reflect-metadata';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipes } from "../../entity/recipes.entity";

@Entity('steps')
export class Steps {
  @PrimaryGeneratedColumn()
  id: number  

  @Column({ 
    type: 'int',
    nullable: true 
  })
  number: number

  @Column({
    type: 'varchar',
  })
  step: string

  @ManyToOne(() => Recipes, (recipe) => recipe.steps, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  recipe: Recipes;
}