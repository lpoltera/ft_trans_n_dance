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

  @ManyToOne(() => User, { onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'name_p1', referencedColumnName: 'username' })
  user_p1: User;

  @ManyToOne(() => User, { nullable: true, onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'name_p2', referencedColumnName: 'username' })
  user_p2: User | null;

  @Column()
  score_p1: number;

  @Column()
  score_p2: number;

  @Column()
  time: number;

  @Column()
  status: string;

  @Column()
  difficulty: string;

  @Column()
  mode: string;

  @Column({ nullable: true })
  mode_value: number;

  @Column()
  power_ups: string;

  @Column({ nullable: true })
  tournament_name: string;

  @Column({ nullable: true })
  tournament_creator: string;

  @ManyToOne(() => User, { nullable: true, onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'tournament_creator', referencedColumnName: 'username' })
  user_tournament_creator: User | null;

  @OneToOne(() => Notification)
  notification: Notification;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
