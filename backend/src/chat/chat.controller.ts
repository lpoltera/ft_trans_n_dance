import { Controller, Get, Res } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('/api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/all')
  async allMessages(@Res() res: any) {
    const messages = await this.chatService.findAll();
    res.json(messages);
  }

  
}
