import { 
  Column, 
  Entity, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany
} from 'typeorm';
import { IsEmail, IsStrongPassword } from 'class-validator';
import { Favorite } from '../../favorite/entity/favorite.entity';

export enum UserRole {
  ADMIN = 'admin',
  NORMAL = 'normal',
  SELLER = 'seller',
}

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true, length: 255 })
  @IsEmail()
  mail: string;

  @Column()
  @IsStrongPassword()
  password: string;

  @Column({ length: 50 })
  first_name: string;

  @Column({ length: 50 })
  last_name: string;

  @Column({ nullable: true, length: 255 })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NORMAL,
  })
  role: UserRole;

  @OneToMany(() => Favorite, favorite => favorite.user)
  favorites: Favorite[];

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;
}