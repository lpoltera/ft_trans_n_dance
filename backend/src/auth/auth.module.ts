/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [HttpModule, ConfigModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
})
export class AuthModule {}
