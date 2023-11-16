import { Controller, Get, Param, Res } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('/api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('all/:sendername/:receivername')
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
