import 'reflect-metadata';
import { 
  Column, 
  Entity, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany,
  OneToOne
} from 'typeorm';
import { IsEmail, IsStrongPassword } from 'class-validator';
import { Favorite } from '../../favorite/entity/favorite.entity';
import { Review } from '../../review/entity/review.entity';
import { Stores } from '../../stores/entity/store.entity';
import { Invoice } from '../../invoice/entity/invoice.entity';

export enum UserRole {
  ADMIN = 'admin',
  NORMAL = 'normal',
  SELLER = 'seller',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true, length: 255, type: 'varchar' })
  @IsEmail()
  mail: string;

  @Column({ select: false, type: 'varchar' })
  @IsStrongPassword()
  password: string;

  @Column({ length: 50, type: 'varchar' })
  first_name: string;

  @Column({ length: 50, type: 'varchar' })
  last_name: string;

  @Column({ nullable: true, length: 255, type: 'varchar' })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NORMAL,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @OneToMany(() => Favorite, favorite => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Invoice, Invoice => Invoice.user)
  invoices: Invoice[];

  @OneToMany(() => Review, review => review.user)
  reviews: Review[];

  @OneToOne(() => Stores, (store) => store.user)
  store: Stores;  

  //For Seller only
  @CreateDateColumn(
    { 
      nullable: true,
      type: 'timestamp',
      default: null,
      comment: 'The date when the seller account was expired'
    }
  )
  expired_at: Date;


  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;
}