import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Notification } from '../../notifications/entities/notifications.entity';

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  friendName: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userName', referencedColumnName: 'username' })
  user: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'friendName', referencedColumnName: 'username' })
  friend: User;

  @CreateDateColumn()
  readonly created_at: Date;

  @UpdateDateColumn()
  readonly updated_at: Date;

  @Column()
  status: string;

  @OneToOne(() => Notification)
  notification: Notification;
  // ..
}

// id | userId | friendId |         created_at         |         updated_at         | status
// ----+--------+----------+----------------------------+----------------------------+---------
//   6 |      4 |        3 | 2023-10-20 11:13:29.9411   | 2023-10-20 11:13:29.9411   | pending
//   7 |      3 |        4 | 2023-10-20 11:14:32.442047 | 2023-10-20 11:14:32.442047 | confirmation
