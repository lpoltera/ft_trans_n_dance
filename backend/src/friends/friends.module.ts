import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { Friendship } from './entities/friends.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Notification } from '../notifications/entities/notifications.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, User, Notification])],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
