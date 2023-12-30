import { Friendship } from '../../friends/entities/friends.entity';
import { MatchsHistory } from '../../matchs-history/entities/matchs-history.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: string;

  @Column()
  receiver: string;

  @Column()
  message: string; // ??

  @Column()
  status: string; // pending or valided

  //   @Column()
  //   read: string; // 'true' or 'false'

  // se // game tournament friend

  @OneToOne(() => MatchsHistory, { onDelete: 'CASCADE' })
  @JoinColumn()
  game: MatchsHistory;

  @OneToOne(() => Friendship)
  @JoinColumn()
  friend: Friendship;
}
