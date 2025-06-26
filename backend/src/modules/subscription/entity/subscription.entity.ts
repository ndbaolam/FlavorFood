import 'reflect-metadata';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invoice } from '../../invoice/entity/invoice.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  subscription_id: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'decimal',
    nullable: true,
  })
  price: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  day_remain: number; // Number of days remaining in the subscription

  @OneToOne(() => Invoice, (Invoice) => Invoice.subscription, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  invoice: Invoice;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
