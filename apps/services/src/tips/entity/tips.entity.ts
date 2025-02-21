import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Tips {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'tip_id',
  })
  tip_id: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
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
}
