import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchsHistory } from '../matchs-history/entities/matchs-history.entity';
import { User } from '../user/entities/user.entity';
import { Notification } from '../notifications/entities/notifications.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchsHistory, Notification, User])],
  controllers: [TournamentsController],
  providers: [TournamentsService],
})
export class TournamentsModule {}
