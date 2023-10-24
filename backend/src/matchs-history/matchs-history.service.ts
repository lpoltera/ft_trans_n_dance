import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMatchsHistoryDto } from './dto/create-matchs-history.dto';
import { UpdateMatchsHistoryDto } from './dto/update-matchs-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchsHistory } from './entities/matchs-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchsHistoryService {
  constructor(
    @InjectRepository(MatchsHistory)
    private readonly MatchDB: Repository<MatchsHistory>,
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
      return 'Game created!'; // return game id
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
