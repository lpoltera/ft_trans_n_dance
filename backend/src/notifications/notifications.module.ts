import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notifications.entity';
import { User } from '../user/entities/user.entity';
import { MatchsHistoryService } from '../matchs-history/matchs-history.service';
import { MatchsHistory } from '../matchs-history/entities/matchs-history.entity';
import { Friendship } from '../friends/entities/friends.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Notification, MatchsHistory, Friendship]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, MatchsHistoryService],
})
export class NotificationsModule {}
