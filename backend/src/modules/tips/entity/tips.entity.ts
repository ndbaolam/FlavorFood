import 'reflect-metadata';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TipGenres } from '../genres/entity/genres.entity';

@Entity('tips')
export class Tips {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'tip_id',
  })
  tip_id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false
  })
  title: string;

  @Column({
    type: 'text',
  })
  thumbnail: string;

  @Column({
    type: 'text',
  })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => TipGenres, (genre) => genre.tips, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'tip_genres', 
    joinColumn: {
      name: 'tip_id',
      referencedColumnName: 'tip_id',
    },
    inverseJoinColumn: {
      name: 'genre_id',
      referencedColumnName: 'genre_id',
    },
  })
  genres: TipGenres[];
}
