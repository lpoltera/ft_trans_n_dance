import { Exclude } from 'class-transformer';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Friendship } from '../../friends/entities/friends.entity';
import { MatchsHistory } from '../../matchs-history/entities/matchs-history.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @Column()
  login42: string;

  @OneToMany(() => Friendship, (friendship) => friendship.user, {
    cascade: true,
  })
  friends: Friendship[];

  @OneToMany(() => MatchsHistory, (matchs) => matchs.user_p1, {
    cascade: true,
  })
  matchsHistory: MatchsHistory[];

  @OneToMany(() => MatchsHistory, (matchs) => matchs.tournament_creator, {
    cascade: true,
  })
  tournament_creator: MatchsHistory[];

  @Column()
  twoFaEnable: boolean;

  @Column()
  connected: string;

  @Column()
  win: number;

  @Column()
  loss: number;

  @Column()
  draw: number;

  @Column()
  totalXP: number;

  @Column()
  totalGame: number;

  @Column()
  @Exclude()
  secret2fa: string;
  // scoresTotal: number;

  @DeleteDateColumn()
  deleteAt: Date;

  //...
}

// classement

// id           points(logi)

// 1               1/7.30min  * 10 = 1.36
// 1               1/2.30min  * 10 = 4.34
