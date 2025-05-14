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

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @OneToOne(() => Invoice, Invoice => Invoice.subscription, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  invoice: Invoice;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
