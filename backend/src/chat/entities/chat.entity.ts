import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO ROOM ??

  @Column()
  sender: string;

  @Column()
  receiver: string;

  @Column()
  text: string;

  @CreateDateColumn()
  createdAt: Date;
}
