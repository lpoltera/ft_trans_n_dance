import { Controller, Get, Post, Body, Patch, Param, Delete, Session } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}


//   (@Body() createUserDto: CreateUserDto)
  @Post('/create')
  create(@Body() CreateNotification: CreateNotificationDto) {
	const receiver = CreateNotification.receiver.valueOf();
    return this.notificationsService.create(receiver);
  }

  @Get('/my')
  findAll(@Session() session: Record<string, any>) {
	const username = session.user.username;
    return this.notificationsService.findAll(username);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
