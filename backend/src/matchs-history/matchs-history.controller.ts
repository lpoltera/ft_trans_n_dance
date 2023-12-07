import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Session,
} from '@nestjs/common';
import { CreateMatchsHistoryDto } from './dto/create-matchs-history.dto';
import { UpdateMatchsHistoryDto } from './dto/update-matchs-history.dto';
import { MatchsHistoryService } from './matchs-history.service';

@Controller('api/game')
export class MatchsHistoryController {
  constructor(private readonly matchsHistoryService: MatchsHistoryService) {}

  @Post('/create')
  async create(
    @Body() createMatchDto: CreateMatchsHistoryDto,
    @Session() sessionUser: Record<string, any>,
  ) {
    return await this.matchsHistoryService.create(
      createMatchDto,
      sessionUser.user.username,
    );
  }

  @Get('/user-history/:user')
  async findhistory(@Param('user') user_name: string) {
    return this.matchsHistoryService.findhistory(user_name);
  }

  @Patch('/update/:id') // id game - body status: valider
  async update(
    @Param('id') id: string,
    @Body() StatusToUpdate: UpdateMatchsHistoryDto,
  ) {
    const statusValue = StatusToUpdate.status.valueOf();
    return await this.matchsHistoryService.update(+id, statusValue);
  }

  @Patch('/update-score/:id')
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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.matchsHistoryService.findOne(+id);
  // }
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.matchsHistoryService.remove(+id);
  // }
}
