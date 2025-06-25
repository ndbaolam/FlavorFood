import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,  CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { Stores as Store } from './store.entity';

@Entity('store_ingredients')
export class StoreIngredient {
  @PrimaryGeneratedColumn()
  ingredient_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column(
    {
      type: 'varchar',
      nullable: false, 
    }
  )
  title: string;

  @Column({ 
    type: 'varchar',
    nullable: true 
  })
  unit: string;

  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Store, store => store.ingredients)
  @JoinColumn({ name: 'store_id' })
  store: Store;
}
