import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../notifications/entities/notifications.entity';
import { CreateMatchsHistoryDto } from './dto/create-matchs-history.dto';
import { MatchsHistory } from './entities/matchs-history.entity';

@Injectable()
export class MatchsHistoryService {
  constructor(
    @InjectRepository(MatchsHistory)
    private readonly MatchDB: Repository<MatchsHistory>,
    @InjectRepository(Notification)
    private readonly notifsDB: Repository<Notification>,
  ) {}
  async create(MatchsHistoryDto: CreateMatchsHistoryDto, name_p1: string) {
    try {
      const match = this.MatchDB.create({
        ...MatchsHistoryDto,
        name_p1: name_p1,
        score_p1: 0,
        score_p2: 0,
        win: 0,
        loss: 0,
        time: 0,
        xp: 0,
        status: 'pending',
      });
      await this.MatchDB.save(match);
      const notif = this.notifsDB.create({
        sender: name_p1,
        receiver: MatchsHistoryDto.name_p2,
        message: `${name_p1} t'invite à le rejoindre pour faire une partie`,
        status: 'pending',
        game: match,
      });
      await this.notifsDB.save(notif);
      return 'Game and notification created!';
    } catch (error) {
      throw new ConflictException('erreur service', error.message);
    }
  }

  async findhistory(name: string) {
    try {
      const games = await this.MatchDB.find({
        where: [
          {
            user_p1: { username: name },
            status: 'pending',
          },
          {
            user_p2: { username: name },
            status: 'pending',
          },
        ],
      });

      games.sort((a: any, b: any) => b.updated_at - a.updated_at);

      const lastTwoUpdates = games.slice(0, 3);

      return lastTwoUpdates;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async update(gameid: number, statusToUpdate: string) {
    const gameToUpdate = await this.MatchDB.findOneBy({ id: gameid });
    if (gameToUpdate) {
      gameToUpdate.status = statusToUpdate;
      this.MatchDB.save(gameToUpdate);
      if (gameToUpdate.status === 'valider') {
        //envoi notification au créateur de la game pour l'informer de l'acceptation
      }
      if (gameToUpdate.status === 'refuser') {
        const id = gameid;
        this.MatchDB.delete({ id });
        //envoi notification au créateur de la game pour l'informer du refus
      }
      const msgToDelete = await this.notifsDB.findOne({
        where: { game: { id: gameid } },
      });
      await this.notifsDB.delete(msgToDelete);

      return `This action updates a #${gameid} matchsHistory to ${statusToUpdate}`;
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} matchsHistory`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} matchsHistory`;
  // }
}
