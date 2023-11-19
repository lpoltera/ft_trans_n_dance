import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Session,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import session from 'express-session';

@Controller('api/friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  // @Post()
  // create(@Body() createFriendDto: CreateFriendDto) {
  //   return this.friendsService.create(createFriendDto);
  // }
  @Post('add/:friendName')
  async addFriend(
    @Param('friendName') friendName: string,
    @Session() sessionUser: Record<string, any>,
  ) {
    const currentUserName = sessionUser.user.username;
    return await this.friendsService.addFriend(currentUserName, friendName);
  }
  @Get('all/:userName')
  async findAll(
    @Param('userName') userName: string,
    // @Session() sessionUser: Record<string, any>
  ) {
    // const currentUserId = sessionUser.user.id
    return await this.friendsService.findAll(userName);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.friendsService.findOne(+id);
  // }
  @Get('blocked/:userName')
  async findBlocked(@Param('userName') username: string) {
    return await this.friendsService.findBlocked(username);
  }

  @Patch(':friendName')
  async update(
    @Param('friendName') friendName: string,
    @Body() StatusToUpdate: UpdateFriendDto,
    @Session() sessionUser: Record<string, any>,
  ) {
    const currentUserName = sessionUser.user.username;
    const statusValue = StatusToUpdate.status.valueOf();
    return await this.friendsService.update(
      currentUserName,
      friendName,
      statusValue,
    );
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.friendsService.remove(+id);
  // }

  @Delete('delete_all')
  removeAll() {
    return this.friendsService.removeAll();
  }
}
