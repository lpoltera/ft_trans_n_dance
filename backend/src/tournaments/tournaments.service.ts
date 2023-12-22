import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchsHistory } from '../matchs-history/entities/matchs-history.entity';
import { Repository } from 'typeorm';
import { matches } from 'class-validator';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(MatchsHistory)
    private readonly MatchDB: Repository<MatchsHistory>,
  ) {}

  async create(create: CreateTournamentDto) {
    try {
      let sortedGames = [];
      for (let i = 0; i < create.participants.length - 1; i++) {
        for (let j = i + 1; j < create.participants.length; j++) {
          const game = this.MatchDB.create({
            name_p1: create.participants[i],
            name_p2: create.participants[j],
            score_p1: 0,
            score_p2: 0,
            time: 0,
            status: 'pending',
            difficulty: create.difficulty,
            mode: create.mode,
            power_ups: create.power_ups,
            tournament_name: create.name,
            tournament_creator: create.tournament_creator,
          });
          sortedGames.push(game);
        }
      }
      const shuffledGames = sortedGames
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      for (let game of shuffledGames) await this.MatchDB.save(game);

      return 'Tournament created!';
    } catch (error) {
      throw new ConflictException('erreur creation tournoi', error.message);
    }
  }

  async findTournamentGames(name: string) {
    try {
      const gamesList = await this.MatchDB.find({
        where: [
          {
            tournament_name: name,
          },
        ],
      });
      return gamesList;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} tournament`;
  }

  async update_score(gameId: number, score_p1: number, score_p2: number) {
    const gameToUpdate = await this.MatchDB.findOneBy({ id: gameId });
    gameToUpdate.score_p1 = score_p1;
    gameToUpdate.score_p2 = score_p2;
    gameToUpdate.status = 'terminer';
    await this.MatchDB.save(gameToUpdate);

    return `This action updates game #${gameId} to ${score_p1} - ${score_p2}`;
  }

  async remove(name: string) {
    const TournamentToDelete = await this.MatchDB.find({
      where: {
        tournament_name: name,
      },
    });
    if (TournamentToDelete.length > 0) {
      const idsToDelete = TournamentToDelete.map((tournament) => tournament.id);
      await this.MatchDB.delete(idsToDelete);
    }
    return `This action removes a #${name} tournament`;
  }

  async getRankings(name: string) {
    console.log(name);
    const rankings = await this.MatchDB.manager.query(
      `
      SELECT name, SUM(wins) as wins, SUM(losses) as losses, SUM(goals_scored) as goals_scored, SUM(goals_conceded) as goals_conceded, SUM(point_difference) as point_difference
      FROM (
        SELECT name_p1 as name, COUNT(*) FILTER (WHERE score_p1 > score_p2) as wins, COUNT(*) FILTER (WHERE score_p1 < score_p2) as losses, SUM(score_p1) as goals_scored, SUM(score_p2) as goals_conceded, SUM(score_p1 - score_p2) as point_difference
        FROM matchs_history
        WHERE tournament_name = $1
        GROUP BY name_p1
        UNION ALL
        SELECT name_p2 as name, COUNT(*) FILTER (WHERE score_p2 > score_p1) as wins, COUNT(*) FILTER (WHERE score_p2 < score_p1) as losses, SUM(score_p2) as goals_scored, SUM(score_p1) as goals_conceded, SUM(score_p2 - score_p1) as point_difference
        FROM matchs_history
        WHERE tournament_name = $1
        GROUP BY name_p2
      ) AS subquery
      GROUP BY name
      ORDER BY wins DESC, point_difference DESC
    `,
      [name],
    );

    return rankings;
  }

  async findAll(name: string) {
    const tournaments = await this.MatchDB.createQueryBuilder('matchs_history')
      .select([
        'matchs_history.tournament_name',
        'matchs_history.tournament_creator',
        // 'matchs_history.status',
      ])
      .where(
        'matchs_history.tournament_name IS NOT NULL AND \
				(matchs_history.name_p1 = :name OR matchs_history.name_p2 = :name)',
        { name: name },
      )
      .groupBy('matchs_history.tournament_name')
      .addGroupBy('matchs_history.tournament_creator')
      // .addGroupBy('matchs_history.status')
      .getRawMany();

    console.log(tournaments);

    const tournaments_names = tournaments.map((tournament) => [
      tournament.matchs_history_tournament_name,
      tournament.matchs_history_tournament_creator,
      // tournament.matchs_history_status,
    ]);
    return tournaments_names; //[[TitoTournoi, tito], [LucieTournoi, lucie]]
  }
}

// liste match tournoi [] utilisant tournamentName
// [] participants

// Tito    2-0 10-5
// Laurent 1-1 7-6
// Lucas   1-1 2-8

//table tournament
// id | tournamentName    | participants | win | loss | PointAfaveur | PointContre
// ---+-------------------+--------------+-----+------+--------------+-------------
// 1  |  mytournamenetname| lucie        | 0   | 1    | 4		         | 5
// 2  |  mytournamenetname|  drem        | 0   | 0    | 0		         | 0
// 3  |  mytournamenetname|  tito        | 1   | 0    | 5		         | 4
// 1  | mytournamenetname2| lucie        | 0   | 0    | 0		         | 0
// 2  | mytournamenetname2|  drem        | 0   | 0    | 0		         | 0
// 3  | mytournamenetname2|  tito        | 0   | 0    | 0		         | 0

// id | nameP1 | nameP2   |         created_at           |         updated_at          | scoreP1 | scoreP2 | status   |  difficulty | mode | powerUps |   TournamentName

// 11 |"tito"	|"lucas"   |	"2023-12-08 10:50:43.597724"|"2023-12-08 11:29:51.690556" |   5	     |    4   |"terminer"|	  "facile" |"1972"|"false"   |	"LucasTournoi
// 12 |"tito"	|"laurent" | "2023-12-08 10:50:43.606585" |"2023-12-08 10:50:43.606585" |   4      |   	5	  |"terminer"|    "facile" |"1972"|"false"	 |  "LucasTournoi"
// 13 |"lucas"	|"laurent" |"2023-12-08 10:50:43.609272"  |"2023-12-08 10:50:43.609272" |   5	     |    2   |"terminer"|    "facile" |"1972"|"false" 	 |  "LucasTournoi"