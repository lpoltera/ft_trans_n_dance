import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ClassTransformer } from 'class-transformer';
import { defaultIfEmpty } from 'rxjs';
import { RelationCountMetadata } from 'typeorm/metadata/RelationCountMetadata';
import { Friendship } from "../../friends/entities/friends.entity"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique : true})
  username: string;

  @Column()
  password: string;

  // @Column({unique : true})
  // @Exclude()
  // email: string;

  @Column()
  @Exclude()
  avatar: string; //path to image ?
  
  @OneToMany(() => Friendship, friendship => friendship.user,{ cascade: true })
  friends: Friendship[];
  // @OneToMany( ? => ?)
  // historyMatch: string;

  //...
}

// classement

// id           points(logi)

// 1               1/7.30min  * 10 = 1.36
// 1               1/2.30min  * 10 = 4.34


// historyMatch
//     Score(my)   Score(adv)  id(adv) date v/d

//         0            5         #15      defaite
//         7            5         #15      victoire
