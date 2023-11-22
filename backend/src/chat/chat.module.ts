import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { Chat } from './entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { Notification } from '../notifications/entities/notifications.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Notification])],
  providers: [ChatGateway, ChatService, NotificationsService],
  controllers: [ChatController],
})
export class ChatModule {}
