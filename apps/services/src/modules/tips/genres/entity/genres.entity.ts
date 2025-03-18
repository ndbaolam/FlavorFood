import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tips } from '../../entity/tips.entity';

@Entity('genres')
export class TipGenres {
  @PrimaryGeneratedColumn({ name: 'genre_id' })
  genre_id: number;

  @Column({
    unique: true
  })
  title: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
  
  @ManyToMany(() => Tips, (tip) => tip.genres, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinTable({
    name: 'tip_genres',
    joinColumn: {
      name: 'genre_id',
      referencedColumnName: 'genre_id',
    },
    inverseJoinColumn: {
      name: 'tip_id',
      referencedColumnName: 'tip_id',
    },
  })
  tips: Tips[];
}