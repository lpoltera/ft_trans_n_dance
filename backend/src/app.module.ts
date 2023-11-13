import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { FriendsModule } from './friends/friends.module';
import { Friendship } from './friends/entities/friends.entity';
import { MatchsHistoryModule } from './matchs-history/matchs-history.module';
import { MatchsHistory } from './matchs-history/entities/matchs-history.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/entities/notifications.entity';
import { Uauth } from './auth/entities/uauth.entity';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.BACKEND_USER,
      password: process.env.BACKEND_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: true, // TODO Pour le développement, à éviter en production
      entities: [User, Friendship, MatchsHistory, Notification, Uauth],
      logging: true,
    }),
    UserModule,
    FriendsModule,
    MatchsHistoryModule,
    NotificationsModule,
    AuthModule,
    ChatModule,
    // SessionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
