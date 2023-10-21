import { Controller, Get, Post, Body, Patch, Param, Delete, Session } from '@nestjs/common';
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
  @Post('add/:friendId')
  async addFriend(
    @Param('friendId') friendId: number,
    @Session() sessionUser: Record<string, any>
  ) {
    const currentUserId = sessionUser.user.id
    return await this.friendsService.addFriend(currentUserId,friendId);
  }
  @Get("all/:userId")
  async findAll(
    @Param('userId') userId: number
    // @Session() sessionUser: Record<string, any>
  ) {
    // const currentUserId = sessionUser.user.id
    return await this.friendsService.findAll(userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.friendsService.findOne(+id);
  // }

  @Patch(':friendId')
  async update(
    @Param('friendId') friendId: number, @Body() StatusToUpdate: UpdateFriendDto,
    @Session() sessionUser: Record<string, any>) 
    {
    const currentUserId = sessionUser.user.id;
    const statusValue = StatusToUpdate.status.valueOf();
    return await this.friendsService.update(currentUserId, friendId, statusValue);
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
