import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Notification } from '../../notifications/entities/notifications.entity';

@Entity()
export class MatchsHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name_p1: string;

  @Column({ nullable: true })
  name_p2: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'name_p1', referencedColumnName: 'username' })
  user_p1: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'name_p2', referencedColumnName: 'username' })
  user_p2: User | null;

  @CreateDateColumn()
  readonly created_at: Date;

  @UpdateDateColumn()
  readonly updated_at: Date;

  @Column()
  score_p1: number;

  @Column()
  score_p2: number;

  // @Column()
  // winner: string; // username winner

  @Column()
  time: number;

  @Column()
  status: string;

  // @Column()
  // difficulty: string;

  // @Column()
  // mode: string;

  // @Column()
  // power_ups: string;

  // @Column()
  // is_tournament: number;   TODO : relation ??

  @OneToOne(() => Notification)
  notification: Notification;

  // 1               1/7.30min  * 10 = 1.36
  // 1               1/2.30min  * 10 = 4.34

  // ..
}
