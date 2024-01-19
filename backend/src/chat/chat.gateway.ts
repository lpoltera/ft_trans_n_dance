/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { Notification } from '../notifications/entities/notifications.entity';
import { CreateMatchsHistoryDto } from '../matchs-history/dto/create-matchs-history.dto';
import { FriendsService } from '../friends/friends.service';
import { MatchsHistoryService } from '../matchs-history/matchs-history.service';

@WebSocketGateway()
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly FriendsService: FriendsService,
    private readonly matchHistoryService: MatchsHistoryService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async create(@MessageBody() message: Chat) {
    await this.chatService.create(message);
    this.server.emit('recMessage', message);
  }

  @SubscribeMessage('sendFriendNotif')
  async createFriendNotif(client: Socket, @MessageBody() notif: Notification) {
    try {
      await this.FriendsService.addFriend(notif.sender, notif.receiver);
      this.server.emit('myNotifs', notif);
    } catch (error) {
      this.server.emit('error', { error: error.message });
    }
  }

  @SubscribeMessage('sendGameInvitationResponse')
  async sendGameInvitationResponse(@MessageBody() response: string) {
    this.server.emit('gameInvitationResponse', response);
  }
  @SubscribeMessage('sendGameNotifs')
  async createGameNotif(
    @MessageBody() data: { game: CreateMatchsHistoryDto; name_p1: string },
  ) {
    const response = await this.matchHistoryService.create(
      data.game,
      data.name_p1,
    );
    this.server.emit('recGameNotifs', response);
  }

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    client.disconnect();
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
  }
}
