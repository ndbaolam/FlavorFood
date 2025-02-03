import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

export enum DifficultyLevel {
  EASY = 'Dễ',
  MEDIUM = 'Trung bình',
  HARD = 'Khó'
}

@Entity('recipes')
export class Recipes {
  @PrimaryGeneratedColumn()
  recipe_id: number;

  @Column()
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
    nullable: true
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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
