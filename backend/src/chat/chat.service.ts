import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(@InjectRepository(Chat) private chatDB: Repository<Chat>) {}
  async create(createChat: Chat) {
    console.log('valeur createChat:', createChat);
    return await this.chatDB.save(createChat);
  }

  async findAll(sender: string, receiver: string): Promise<Chat[]> {
    // const receiverName: any = receiver;
    // const senderName: any = sender;
    console.log('Receiver in findAll = ', sender);
    console.log('Sender in findAll = ', receiver);

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

  // findOne(id: number) {
  //   return `This action returns a #${id} chat`;
  // }

  // update(id: number, updateChatDto: UpdateChatDto) {
  //   return `This action updates a #${id} chat`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} chat`;
  // }
}
