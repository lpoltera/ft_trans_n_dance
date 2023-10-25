import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Uauth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  school42Id: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;
}