import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Friendship } from '../friends/entities/friends.entity';
import { MatchsHistory } from '../matchs-history/entities/matchs-history.entity';
import { Notification } from '../notifications/entities/notifications.entity';
import { QrCodeService } from '../config/otp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friendship, MatchsHistory, Notification]),
  ],
  controllers: [UserController],
  providers: [UserService, QrCodeService],
})
export class UserModule {}
