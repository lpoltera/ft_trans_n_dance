import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateMatchsHistoryDto } from './dto/create-matchs-history.dto';
import { UpdateMatchsHistoryDto } from './dto/update-matchs-history.dto';
import { MatchsHistoryService } from './matchs-history.service';
import { revengeDTO } from './dto/revenge.dto';
import { SessionGuard } from '../session/session.guard';

@Controller('api/game')
export class MatchsHistoryController {
  constructor(private readonly matchsHistoryService: MatchsHistoryService) {}

  @Post('/create')
  @UseGuards(SessionGuard)
  async create(
    @Body() createMatchDto: CreateMatchsHistoryDto,
    @Session() sessionUser: Record<string, any>,
  ) {
    return await this.matchsHistoryService.create(
      createMatchDto,
      sessionUser.user.username,
    );
  }

  @Post('/revenge')
  @UseGuards(SessionGuard)
  async revenge(@Body() gameId: revengeDTO) {
    const gameid = gameId.id.valueOf();
    return await this.matchsHistoryService.revenge(gameid);
  }

  @Get('/user-history/:user')
  @UseGuards(SessionGuard)
  async findhistory(@Param('user') user_name: string) {
    return this.matchsHistoryService.findhistory(user_name);
  }

  @Patch('/update/:id')
  @UseGuards(SessionGuard)
  async update(
    @Param('id') id: string,
    @Body() StatusToUpdate: UpdateMatchsHistoryDto,
  ) {
    const statusValue = StatusToUpdate.status.valueOf();
    return await this.matchsHistoryService.update(+id, statusValue);
  }

  @Patch('/update-score/:id')
  @UseGuards(SessionGuard)
  async updateScore(
    @Param('id') id: string,
    @Body() ScoreToUpdate: UpdateMatchsHistoryDto,
  ) {
    const scoreP1Value = ScoreToUpdate.score_p1.valueOf();
    const scoreP2Value = ScoreToUpdate.score_p2.valueOf();

    return await this.matchsHistoryService.updateScore(
      +id,
      +scoreP1Value,
      +scoreP2Value,
    );
  }

  @Get(':id')
  @UseGuards(SessionGuard)
  findOne(@Param('id') id: string) {
    return this.matchsHistoryService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  remove(@Param('id') id: string) {
    return this.matchsHistoryService.remove(+id);
  }

  @Get('/check/:id')
  @UseGuards(SessionGuard)
  async check(@Param('id') id: string) {
    return await this.matchsHistoryService.check(+id);
  }
}
