/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';

import { QrCodeService } from '../config/otp.service';
import { CreateUserDto } from './dto/create-user.dto';
import { loginDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/UserResponseDto';
import { SessionGuard } from '../session/session.guard';

@Controller('api')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly optService: QrCodeService,
  ) {}

  @Post('signup')
  async create(
    @Body() createUserDto: CreateUserDto,
    @Session() session: Record<string, any>,
  ) {
    return await this.userService.create(createUserDto, session);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/login')
  async login(
    @Body() loginDto: loginDto,
    @Session() session: Record<string, any>,
  ) {
    const user = await this.userService.login(loginDto, session);
    const response = {
      message: 'Login successful',
      usertwoFA: user.twoFaEnable,
    };

    return response;
  }

  @Get('/qrcode')
  async generateQrCode(@Session() session: Record<string, any>) {
    if (!session.login42) {
      session.login42 = 'johndoe';
      session.secret = 'NQYCCXKGKITDAJJJIBHTS2CQLIXDM6B7KJUESSLQPJNEM6KCJVTQ';
    } //	dev mode (sans passer par API 42)
    return await this.userService.generateQrCode(
      session.secret,
      session.login42,
    );
  }

  @Post('/twofacheck')
  async twoFaCheck(@Session() session: Record<string, any>, @Body() { token }) {
    return await this.userService.twofaCheck(
      session.user.username,
      token,
      session,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/all')
  @UseGuards(SessionGuard)
  async findAll() {
    return await this.userService.findAll();
  }

  @Post('/logout')
  async logout(@Session() session: Record<string, any>) {
    if (session.user) {
      const username = await session.user.username;
      await session.destroy(() => {});
      return await this.userService.logout(username);
    }
  }

  @Get('/connected')
  async isconnected(@Session() session: Record<string, any>) {
    if (session.connected) return true;
    else return false;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/user')
  @UseGuards(SessionGuard)
  async getUsername(@Session() session: Record<string, any>) {
    return await session.user;
  }

  @Get('/my-name')
  @UseGuards(SessionGuard)
  async getMyName(
    @Session() session: Record<string, any>,
  ): Promise<UserResponseDto | null> {
    if (session.user) {
      const userResponse: UserResponseDto = {
        id: session.user.id,
        username: session.user.username,
        avatar: session.user.avatar,
        connected: session.user.connected,
        win: session.user.win,
        loss: session.user.loss,
        totalGame: session.user.totalGame,
      };
      return userResponse;
    } else return null;
  }

  @Get('/:username')
  @UseGuards(SessionGuard)
  async findOne(
    @Param('username') username: string,
  ): Promise<UserResponseDto | null> {
    const userResponse: UserResponseDto =
      await this.userService.findOne(username);
    if (userResponse) return userResponse;
    else throw new NotFoundException('User not found');
  }

  @Patch(':username')
  @UseGuards(SessionGuard)
  async update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
    @Session() session: Record<string, any>,
  ) {
    return await this.userService.update(username, updateUserDto, session);
  }

  @Delete(':username')
  @UseGuards(SessionGuard)
  async remove(
    @Param('username') name: string,
    @Session() session: Record<string, any>,
  ) {
    return await this.userService.remove(name, session);
  }
}
