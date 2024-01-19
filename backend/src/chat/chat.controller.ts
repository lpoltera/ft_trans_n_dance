import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SessionGuard } from '../session/session.guard';

@Controller('/api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('all/:sendername/:receivername')
  @UseGuards(SessionGuard)
  async allMessages(
    @Param('sendername') sendername: string,
    @Param('receivername') receivername: string,
    @Res() res: any,
  ) {
    const senderNameValue = sendername;
    const receiverNameValue = receivername;
    const messages = await this.chatService.findAll(
      senderNameValue,
      receiverNameValue,
    );
    res.json(messages);
  }
}
