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

  @Column(
    {
      type: 'varchar',
      nullable: false,      
    }
  )
  title: string;

  @Column(
    {
      type: 'text',
      nullable: false,
    }
  )
  description: string;

  @Column(
    {
      type: 'decimal',
      nullable: false,
    }
  )
  price: number;

  @Column(
    {
      type: 'int',
      nullable: false,
    }
  )
  day_remain: number; // Number of days remaining in the subscription

  @OneToOne(() => Invoice, Invoice => Invoice.subscription, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  invoice: Invoice;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
