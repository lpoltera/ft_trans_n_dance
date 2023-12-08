import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@Controller('api/tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post('create')
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @Get('all/:name')
  findAll(@Param('name') name: string) {
    return this.tournamentsService.findTournamentGames(name);
  }

  @Get('ranking/:name')
  getRanking(@Param('name') name: string) {
    return this.tournamentsService.getRankings(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOne(+id);
  }

  @Patch('update-score/:id')
  update(
    @Param('id') id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    const scoreP1Value = updateTournamentDto.score_p1.valueOf();
    const scoreP2Value = updateTournamentDto.score_p2.valueOf();
    return this.tournamentsService.update_score(
      +id,
      +scoreP1Value,
      +scoreP2Value,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentsService.remove(+id);
  }
}
