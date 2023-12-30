import { Global, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { Chat } from './entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { Notification } from '../notifications/entities/notifications.entity';
import { Friendship } from '../friends/entities/friends.entity';
import { FriendsService } from '../friends/friends.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { MatchsHistoryService } from '../matchs-history/matchs-history.service';
import { MatchsHistory } from '../matchs-history/entities/matchs-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Chat,
      Friendship,
      Notification,
      User,
      MatchsHistory,
    ]),
  ],
  providers: [
    ChatGateway,
    ChatService,
    FriendsService,
    NotificationsService,
    MatchsHistoryService,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
