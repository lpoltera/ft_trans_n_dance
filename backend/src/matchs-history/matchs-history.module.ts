import { Module } from '@nestjs/common';
import { MatchsHistoryService } from './matchs-history.service';
import { MatchsHistoryController } from './matchs-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { MatchsHistory } from './entities/matchs-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, MatchsHistory])],
  controllers: [MatchsHistoryController],
  providers: [MatchsHistoryService],
})
export class MatchsHistoryModule {}
