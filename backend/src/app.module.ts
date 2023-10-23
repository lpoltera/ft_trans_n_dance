import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { FriendsModule } from './friends/friends.module';
import { AuthModule } from './auth/auth.module';
import { Friendship } from './friends/entities/friends.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.BACKEND_USER,
      password: process.env.BACKEND_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: true, // Pour le développement, à éviter en production
      entities: [User, Friendship], // Vous ajouterez vos entités ici
      logging: true,
    }),
    UserModule,
    FriendsModule,
	AuthModule,
    // SessionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
