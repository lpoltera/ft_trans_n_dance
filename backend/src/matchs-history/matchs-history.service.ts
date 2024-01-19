import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Notification } from '../notifications/entities/notifications.entity';
import { CreateMatchsHistoryDto } from './dto/create-matchs-history.dto';
import { MatchsHistory } from './entities/matchs-history.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MatchsHistoryService {
  constructor(
    @InjectRepository(MatchsHistory)
    private readonly MatchDB: Repository<MatchsHistory>,
    @InjectRepository(Notification)
    private readonly notifsDB: Repository<Notification>,
    @InjectRepository(User)
    private readonly userDB: Repository<User>,
  ) {}

  async create(MatchsHistoryDto: CreateMatchsHistoryDto, name_p1: string) {
    try {
      const match = this.MatchDB.create({
        ...MatchsHistoryDto,
        name_p1: name_p1,
        score_p1: 0,
        score_p2: 0,
        time: 0,
        status: 'pending',
      });
      await this.MatchDB.save(match);
      if (MatchsHistoryDto.name_p2) {
        const notif = this.notifsDB.create({
          sender: name_p1,
          receiver: MatchsHistoryDto.name_p2,
          message: `${name_p1} t'invite à le rejoindre pour faire une partie`,
          status: 'pending',
          game: match,
        });
        await this.notifsDB.save(notif);
        return [match.id, notif];
      } else {
        match.status = 'en cours';
        await this.MatchDB.save(match);
        return [match.id];
      }
    } catch (error) {
      throw new ConflictException('erreur service', error.message);
    }
  }

  async revenge(previousId: number) {
    try {
      const previousGame = await this.MatchDB.findOneBy({
        id: previousId,
      });
      const game = previousGame;
      game.id = null;
      game.score_p1 = 0;
      game.score_p2 = 0;
      game.status = 'en cours';

      await this.MatchDB.save(game);
      return [game.id];
    } catch (error) {
      throw new ConflictException('erreur service', error.message);
    }
  }

  async findhistory(name: string) {
    try {
      const games = await this.MatchDB.createQueryBuilder('match')
        .where(
          '(match.user_p1.username = :name OR match.user_p2.username = :name) AND match.tournament_name IS NULL AND match.status = :status',
          { name: name, status: 'terminé' },
        )
        .getMany();

      const gamesSortedbyUpdatedDate = games.sort(
        (a: any, b: any) => b.updated_at - a.updated_at,
      );

      return gamesSortedbyUpdatedDate;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async update(gameid: number, statusToUpdate: string) {
    const gameToUpdate = await this.MatchDB.findOneBy({ id: gameid });
    if (gameToUpdate) {
      gameToUpdate.status = statusToUpdate;
      this.MatchDB.save(gameToUpdate);
      if (gameToUpdate.status === 'en cours') {
      }
      if (gameToUpdate.status === 'refuser') {
        const id = gameid;
        this.MatchDB.delete({ id });
      }
      const msgToDelete = await this.notifsDB.findOne({
        where: { game: { id: gameid } },
      });
      await this.notifsDB.delete(msgToDelete);

      return `This action updates a #${gameid} matchsHistory to ${statusToUpdate}`;
    }
  }

  async updateScore(gameid: number, scoreP1: number, scoreP2: number) {
    try {
      const gameToUpdate = await this.MatchDB.findOneBy({
        id: gameid,
        status: Not('terminé'),
      });
      if (gameToUpdate && gameToUpdate.status !== 'terminé') {
        gameToUpdate.score_p1 = scoreP1;
        gameToUpdate.score_p2 = scoreP2;
        gameToUpdate.status = 'terminé';
        await this.MatchDB.save(gameToUpdate);
        if (gameToUpdate.tournament_name === null) {
          if (scoreP1 > scoreP2) {
            this.userDB.increment({ username: gameToUpdate.name_p1 }, 'win', 1);
            this.userDB.increment(
              { username: gameToUpdate.name_p2 },
              'loss',
              1,
            );
          } else {
            this.userDB.increment({ username: gameToUpdate.name_p2 }, 'win', 1);
            this.userDB.increment(
              { username: gameToUpdate.name_p1 },
              'loss',
              1,
            );
          }
          this.userDB.increment(
            { username: gameToUpdate.name_p1 },
            'totalGame',
            1,
          );
          this.userDB.increment(
            { username: gameToUpdate.name_p2 },
            'totalGame',
            1,
          );
        }
        return `This action updates a #${gameid} matchsHistory to ${scoreP1} - ${scoreP2}`;
      }
      return `Nothing to do`;
    } catch (error) {
      console.error('Error while finding match:', error);
    }
  }

  async findOne(id: number) {
    const game = await this.MatchDB.findOne({ where: { id: id } });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  async remove(id: number) {
    await this.MatchDB.delete({ id });
    return `This action removes a #${id} matchsHistory`;
  }

  async check(id: number) {
    const game = await this.MatchDB.findOne({ where: { id: id } });
    if (!game) {
      return 'false';
    }
    return 'true';
  }
}
