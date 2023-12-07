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
// import { NotificationsService } from '../notifications/notifications.service';
import { FriendsService } from '../friends/friends.service';

@WebSocketGateway()
export class ChatGateway {
  // implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  constructor(
    private readonly chatService: ChatService,
    private readonly FriendsService: FriendsService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async create(@MessageBody() message: Chat) {
    await this.chatService.create(message);
    this.server.emit('recMessage', message);
  }

  @SubscribeMessage('sendFriendNotif') // sendFriendNotif
  async createNotif(client: Socket, @MessageBody() notif: Notification) {
    console.log('sendNotifs called');
    try {
      await this.FriendsService.addFriend(notif.sender, notif.receiver);
      this.server.emit('myNotifs', notif);
    } catch (error) {
      this.server.emit('error', { error: error.message });
    }
  }

  // @SubscribeMessage('sendGameNotifs')
  // async createNotif(client: Socket, @MessageBody() notif: Notification) {
  //   console.log('sendNotifs called');
  //   await this.NotifsService.create(notif); // game service
  //   this.server.emit('myNotifs', notif);
  // }

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
