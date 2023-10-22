import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class MatchsHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_p1: number;

  @Column()
  id_p2: number;
  
  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_p1' })
  user_p1: User;
  
  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_p2' })
  user_p2: User;
  
  @CreateDateColumn()
  readonly created_at: Date
  
  @UpdateDateColumn()
  readonly updated_at: Date

  @Column()
  score_p1: number;
  
  @Column()
  score_p2: number;

  @Column()
  win: number; // id_p1 or id_p2

  @Column()
  loss: number; // id_p1 or id_p2
  
  @Column()
  time: number;
  
  @Column()
  xp: number;
  // 1               1/7.30min  * 10 = 1.36
  // 1               1/2.30min  * 10 = 4.34

  // ..
}