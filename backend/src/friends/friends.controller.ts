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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { FriendsService } from './friends.service';
import { relationDto } from './dto/relation.dto';
import { SessionGuard } from '../session/session.guard';

@Controller('api/friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('add/:friendName')
  @UseGuards(SessionGuard)
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
  @UseGuards(SessionGuard)
  async findAll(@Param('userName') userName: string) {
    const friends = await this.friendsService.findAll(userName);
    if (!friends) {
      return [];
    }
    return friends;
  }

  @Get('blocked/:userName')
  @UseGuards(SessionGuard)
  async findBlocked(@Param('userName') username: string) {
    return await this.friendsService.findBlocked(username);
  }

  @Patch(':friendName')
  @UseGuards(SessionGuard)
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

  @Delete(':name')
  @UseGuards(SessionGuard)
  remove(@Param('name') name: string, @Session() session: Record<string, any>) {
    return this.friendsService.removeFriend(session.user.username, name);
  }

  @Delete('delete_all')
  @UseGuards(SessionGuard)
  removeAll() {
    return this.friendsService.removeAll();
  }

  @Get('relations')
  @UseGuards(SessionGuard)
  async getRelations(
    @Session() session: Record<string, any>,
  ): Promise<relationDto[]> {
    const currentUserName = session.user.username;
    const relations = await this.friendsService.getRelations(currentUserName);
    if (!relations) {
      return [];
    }
    return relations;
  }
}
