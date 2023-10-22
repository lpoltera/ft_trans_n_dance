import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMatchsHistoryDto } from './dto/create-matchs-history.dto';
import { UpdateMatchsHistoryDto } from './dto/update-matchs-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchsHistory } from './entities/matchs-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchsHistoryService {

  constructor(
    @InjectRepository(MatchsHistory) private readonly MatchDB: Repository<MatchsHistory>, 
    ) {}
  async create(MatchsHistoryDto: CreateMatchsHistoryDto, id_p1: number) {
    try {
      const match = this.MatchDB.create({...MatchsHistoryDto, id_p1: id_p1, score_p1:0, score_p2:0, win: 0, loss:0, time:0 , xp:0})
      await this.MatchDB.save(match)
      return 'Game created!';
    } catch (error) {
      throw new ConflictException(error.message)
    }
  }

  // findAll() {
  //   return `This action returns all matchsHistory`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} matchsHistory`;
  // }

  // update(id: number, updateMatchsHistoryDto: UpdateMatchsHistoryDto) {
  //   return `This action updates a #${id} matchsHistory`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} matchsHistory`;
  // }
}
