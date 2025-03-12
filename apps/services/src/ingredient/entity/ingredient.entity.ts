import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipes } from "../../recipes/entity/recipes.entity";

@Entity('ingredient')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ingredient: string;

  @Column({ type: 'double precision' })
  quantity: number;

  @Column()
  unit: string;

  @ManyToOne(() => Recipes, (recipe) => recipe.ingredients, 
    { 
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    }
  )
  recipe: Recipes;
}