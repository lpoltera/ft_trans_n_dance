import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uauth } from './entities/uauth.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './oauth2.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [HttpModule, ConfigModule, TypeOrmModule.forFeature([Uauth])],
	controllers: [AuthController],
	providers: [AuthService, ConfigService],
})
export class AuthModule {}
