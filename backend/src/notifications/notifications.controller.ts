import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Notification } from './entities/notifications.entity';
import { NotificationsService } from './notifications.service';
import { SessionGuard } from '../session/session.guard';

@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('/create')
  @UseGuards(SessionGuard)
  create(@Body() Notifs: Notification) {
    return this.notificationsService.create(Notifs);
  }

  @Get('/my')
  @UseGuards(SessionGuard)
  findAll(@Session() session: Record<string, any>) {
    const username = session.user.username;
    return this.notificationsService.findAll(username);
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
