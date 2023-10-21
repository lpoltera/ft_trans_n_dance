import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { Friendship } from './entities/friends.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship])],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
