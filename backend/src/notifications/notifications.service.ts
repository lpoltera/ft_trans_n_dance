/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notifications.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notifsDB: Repository<Notification>,
  ) {}
  async create(notif: Notification) {
    try {
      const notification = this.notifsDB.create({
        sender: notif.sender,
        receiver: notif.receiver,
        message: notif.message,
        status: 'pending',
      });
      await this.notifsDB.save(notification);
    } catch (error) {
      throw new ConflictException('erreur lors de la création', error.message);
    }
    return 'Notification Created!';
  }
  //     return 'This action adds a new notification';
  //   }

  async findAll(username: string) {
    const userNotifs = await this.notifsDB.find({
      where: { receiver: username },
      relations: ['game', 'friend'],
    });

    if (!userNotifs) return null;

    // const userNotifsMsg = userNotifs.map((item) => item.message);
    return userNotifs;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return this.notifsDB.delete({ id });
  }
}
