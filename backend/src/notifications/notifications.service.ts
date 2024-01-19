/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findAll(username: string) {
    const userNotifs = await this.notifsDB.find({
      where: { receiver: username },
      relations: ['game', 'friend'],
    });

    if (!userNotifs) return null;
    return userNotifs;
  }

  remove(id: number) {
    return this.notifsDB.delete({ id });
  }
}
