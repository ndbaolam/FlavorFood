import 'reflect-metadata';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../../users/entity/users.entity';
import { Subscription } from '../../subscription/entity/subscription.entity';

export enum InvoiceStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

@Entity({ name: 'invoice' })
export class Invoice {
  @PrimaryGeneratedColumn()
  invoice_id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column({ nullable: true, type: 'text' })
  @IsString()
  @IsOptional()
  description?: string;

  @Column({ type: 'enum', enum: InvoiceStatus })
  @IsEnum(InvoiceStatus)
  @IsNotEmpty()
  status: InvoiceStatus;

  @ManyToOne(() => Users, (user) => user.invoices, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Subscription, (sub) => sub.invoice, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
