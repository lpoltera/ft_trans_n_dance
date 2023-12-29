import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Notification } from '../notifications/entities/notifications.entity';
import { CreateMatchsHistoryDto } from './dto/create-matchs-history.dto';
import { MatchsHistory } from './entities/matchs-history.entity';
import { pbkdf2 } from 'crypto';
import { User } from '../user/entities/user.entity';
import { MatchsHistoryDto } from './dto/matchs-histoty.dto';

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

  toDto(game: MatchsHistory): MatchsHistoryDto {
    return {
      id: game.id,
      player1: game.name_p1,
      player2: game.name_p2 || null,
      scorePlayer1: game.score_p1,
      scorePlayer2: game.score_p2,
      difficulty: game.difficulty,
      duration: game.time,
      status: game.status,
      mode: game.mode,
      mode_value: game.mode_value,
      powerUps: game.power_ups,
      tournament: game.tournament_name,
      updatedAt: game.updated_at,
      createdAt: game.created_at,
    };
  }

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
        return match.id;
      } else {
        match.status = 'en cours';
        await this.MatchDB.save(match);
        return match.id;
      }
    } catch (error) {
      throw new ConflictException('erreur service', error.message);
    }
  }

  async findhistory(name: string) {
    try {
      const games = await this.MatchDB.createQueryBuilder('match')
        .where(
          '(match.user_p1.username = :name OR match.user_p2.username = :name) AND match.status = :status AND match.tournament_name IS NULL',
          { name: name, status: 'pending' },
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

  async updateScore(gameid: number, scoreP1: number, scoreP2: number) {
    try {
      const gameToUpdate = await this.MatchDB.findOneBy({
        id: gameid,
        status: Not('terminer'),
      });
      if (gameToUpdate) {
        gameToUpdate.score_p1 = scoreP1;
        gameToUpdate.score_p2 = scoreP2;
        gameToUpdate.status = 'terminer';
        await this.MatchDB.save(gameToUpdate);
        console.log('gameToUpdate', gameToUpdate);
        if (scoreP1 > scoreP2) {
          console.log('p1 win');
          this.userDB.increment({ username: gameToUpdate.name_p1 }, 'win', 1);
          this.userDB.increment({ username: gameToUpdate.name_p2 }, 'loss', 1);
        } else {
          console.log('p2 win');
          this.userDB.increment({ username: gameToUpdate.name_p2 }, 'win', 1);
          this.userDB.increment({ username: gameToUpdate.name_p1 }, 'loss', 1);
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
        return `This action updates a #${gameid} matchsHistory to ${scoreP1} - ${scoreP2}`;
      }
    } catch (error) {
      console.error('Error while finding match:', error);
    }
  }

  async findOne(id: number) {
    const game = await this.MatchDB.findOne({ where: { id: id } });
    return this.toDto(game);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} matchsHistory`;
  // }
}
