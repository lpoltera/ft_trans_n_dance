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

// import { Session } from '@nestjs/common';
import { Notification } from '../notifications/entities/notifications.entity';
import { CreateMatchsHistoryDto } from '../matchs-history/dto/create-matchs-history.dto'; // import { NotificationsService } from '../notifications/notifications.service';
import { FriendsService } from '../friends/friends.service';
import { MatchsHistoryService } from '../matchs-history/matchs-history.service';

@WebSocketGateway()
export class ChatGateway {
  // implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
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

  @SubscribeMessage('sendFriendNotif') // sendFriendNotif
  async createFriendNotif(client: Socket, @MessageBody() notif: Notification) {
    console.log('sendNotifs called');
    try {
      await this.FriendsService.addFriend(notif.sender, notif.receiver);
      this.server.emit('myNotifs', notif);
    } catch (error) {
      this.server.emit('error', { error: error.message });
    }
  }

  @SubscribeMessage('sendGameInvitationResponse')
  async sendGameInvitationResponse(
    client: Socket,
    @MessageBody() response: string,
  ) {
    console.log('sendGameInvitationResponse called');
    this.server.emit('gameInvitationResponse', response);
  }

  @SubscribeMessage('sendGameNotifs')
  async createGameNotif(
    client: Socket,
    @MessageBody() data: { game: CreateMatchsHistoryDto; name_p1: string },
  ) {
    console.log('sendGameNotif called');
    const response = await this.matchHistoryService.create(
      data.game,
      data.name_p1,
    );
    // const notif = response.notif;
    // const gameid = response.matchId;
    this.server.emit('recGameNotifs', response);
  }

  afterInit(server: Server) {
    console.log(server);
    //Do stuffs
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    client.disconnect();
    //Do stuffs
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
    //Do stuffs
  }

  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatService.findOne(id);
  // }

  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(updateChatDto.id, updateChatDto);
  // }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatService.remove(id);
  // }
}
