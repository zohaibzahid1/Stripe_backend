import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar?: string;

  // 🔐 Google OAuth related
  @Column({ nullable: true })
  googleId?: string;

  // 💳 Stripe payment details
  @Column({ nullable: true })
  stripeCustomerId?: string;

  @Column({ nullable: true })
  stripeSubscriptionId?: string;

  @Column({ default: false })
  isSubscribed: boolean;

  @Column({ nullable: true })
  subscriptionPlan?: string; // e.g., 'pro_monthly', 'promax_yearly'

  @Column({ nullable: true })
  subscriptionStatus?: string; // e.g., 'active', 'canceled', 'past_due'

  @Column({ type: 'timestamptz', nullable: true })
  currentPeriodEnd?: Date;

  @Column({ default: false })
  hasOneTimePaid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
