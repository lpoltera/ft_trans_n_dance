import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
} from '@nestjs/common';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notifications.entity';
import { NotificationsService } from './notifications.service';

@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  //   (@Body() createUserDto: CreateUserDto)
  @Post('/create')
  create(@Body() Notifs: Notification) {
    return this.notificationsService.create(Notifs);
  }

  @Get('/my')
  findAll(@Session() session: Record<string, any>) {
    const username = session.user.username;
    return this.notificationsService.findAll(username);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.notificationsService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
