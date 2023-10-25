import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Req, Session, UnsupportedMediaTypeException, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { loginDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { SessionGuard } from '../session/session.guard';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/signup")
   async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("/login")
  async login(@Body() loginDto: loginDto, @Session() session : Record<string, any>) {
    const user = await this.userService.login(loginDto);
    session.user = user
    session.connected = true
	// session.user.connected = true
    return { message: 'Login successful'};
  }
  
  @Get("/all")
  // @UseGuards(SessionGuard) // TODO
  async findAll(@Req() request: Request, @Session() session : Record<string, any>) {
      return await this.userService.findAll();
  }

  @Post("/logout")
  async logout(@Session() session : Record<string, any>) {
	await session.destroy(() => {});
	return await this.userService.logout(session.user.username); 
  }
 
  @Get("/connected")
  async isconnected(@Req() request: Request, @Session() session : Record<string, any>) {
    if (session.connected)
      return true;
    else
      return false;
  }
  @Get("/user")
  // @UseGuards(SessionGuard) // TODO
  async getUsername(@Req() request: Request, @Session() session : Record<string, any>) {
    return await session.user
  }

  @Get(':username')
  // @UseGuards(SessionGuard) // TODO
  async findOne(@Param('username') username: string) {
    return await this.userService.findOne(username);
  }

  @Patch(':username')
  async update(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(username, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }
}
