import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { FriendsService } from './friends.service';
import { relationDto } from './dto/relation.dto';

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
  ): Promise<string> {
    const currentUserName = sessionUser.user.username;
    const requestStatus = await this.friendsService.addFriend(
      currentUserName,
      friendName,
    );
    if (requestStatus) {
      return requestStatus;
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('all/:userName')
  async findAll(
    @Param('userName') userName: string,
    // @Session() sessionUser: Record<string, any>
  ) {
    const friends = await this.friendsService.findAll(userName);
    if (!friends) {
      return [];
    }
    return friends;
  }

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

  @Get('relations')
  async getRelations(
    @Session() session: Record<string, any>,
  ): Promise<relationDto[]> {
    // console.log('username = ', session.user.username);
    const currentUserName = session.user.username;
    const relations = await this.friendsService.getRelations(currentUserName);
    if (!relations) {
      return [];
    }
    return relations;
  }
}
