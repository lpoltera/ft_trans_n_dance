import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uauth } from './entities/uauth.entity';
import { AuthController } from './auth.controller';
import { Oauth2Strategy } from './oauth2.service';

@Module({
  imports: [TypeOrmModule.forFeature([Uauth])],
  controllers: [AuthController],
  providers: [Oauth2Strategy],
})
export class AuthModule {}