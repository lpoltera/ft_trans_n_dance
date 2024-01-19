import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(@InjectRepository(Chat) private chatDB: Repository<Chat>) {}
  async create(createChat: Chat) {
    console.log('valeur createChat:', createChat);
    return await this.chatDB.save(createChat);
  }

  async findAll(sender: string, receiver: string): Promise<Chat[]> {
    const room = await this.chatDB.find({
      where: [
        {
          sender: sender,
          receiver: receiver,
        },
        {
          sender: receiver,
          receiver: sender,
        },
      ],
    });

    return room;
  }
}
