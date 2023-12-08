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

//table tournamentGame
// id | nameP1 | nameP2 |         created_at         |         updated_at         | scoreP1 | scoreP2 | time | status  |   TournamentName      | difficulty | mode | powerUps
// ---+--------+--------+----------------------------+----------------------------+---------+---------+------+---------+-----------------------+------------+------+----------
//  1 |  tito  |  lucie | 2023-10-20 11:13:29.9411   | 2023-10-20 11:13:29.9411   | 5	      | 4       | 0    | pending |  mytournamenetname    | 2          | 0    | 0
//  2 |  tito  |  drem  | 2023-10-20 11:13:29.9411   | 2023-10-20 11:13:29.9411   | 0	      | 0       | 0    | pending |  mytournamenetname    | 2          | 0    | 0
//  3 |  drem  |  lucie | 2023-10-20 11:13:29.9411   | 2023-10-20 11:13:29.9411   | 0	      | 0       | 0    | pending |  mytournamenetname    | 2          | 0    | 0
//  1 |  tito  |  lucie | 2023-10-20 11:13:29.9411   | 2023-10-20 11:13:29.9411   | 0	      | 0       | 0    | pending |  mytournamenetname2   | 2          | 0    | 0
//  2 |  tito  |  drem  | 2023-10-20 11:13:29.9411   | 2023-10-20 11:13:29.9411   | 0	      | 0       | 0    | pending |  mytournamenetname2   | 2          | 0    | 0
//  3 |  drem  |  lucie | 2023-10-20 11:13:29.9411   | 2023-10-20 11:13:29.9411   | 0	      | 0       | 0    | pending |  mytournamenetname2   | 2          | 0    | 0

//table tournament
// id | tournamentName    | participants | win | loss | PointAfaveur | PointContre
// ---+-------------------+--------------+-----+------+--------------+-------------
// 1  |  mytournamenetname| lucie        | 0   | 1    | 4		         | 5
// 2  |  mytournamenetname|  drem        | 0   | 0    | 0		         | 0
// 3  |  mytournamenetname|  tito        | 1   | 0    | 5		         | 4
// 1  | mytournamenetname2| lucie        | 0   | 0    | 0		         | 0
// 2  | mytournamenetname2|  drem        | 0   | 0    | 0		         | 0
// 3  | mytournamenetname2|  tito        | 0   | 0    | 0		         | 0
