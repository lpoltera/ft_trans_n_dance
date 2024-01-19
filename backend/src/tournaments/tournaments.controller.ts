import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Session,
  UseGuards,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { SessionGuard } from '../session/session.guard';

@Controller('api/tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post('create')
  @UseGuards(SessionGuard)
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @Get('all')
  @UseGuards(SessionGuard)
  async findAllTournaments(@Session() session: Record<string, any>) {
    return this.tournamentsService.findAll(session.user.username);
  }

  @Get('games/:name')
  @UseGuards(SessionGuard)
  findAll(@Param('name') name: string) {
    return this.tournamentsService.findTournamentGames(name);
  }

  @Get('next_game/:name')
  @UseGuards(SessionGuard)
  findNext(@Param('name') name: string) {
    return this.tournamentsService.findNextGame(name);
  }

  @Get('ranking/:name')
  @UseGuards(SessionGuard)
  getRanking(@Param('name') name: string) {
    return this.tournamentsService.getRankings(name);
  }

  @Patch('update-score/:id')
  @UseGuards(SessionGuard)
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

  @Delete(':name')
  @UseGuards(SessionGuard)
  remove(@Param('name') name: string) {
    return this.tournamentsService.remove(name);
  }
}
