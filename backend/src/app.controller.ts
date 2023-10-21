import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get("/api")
  // getapi(): string {
  //   return this.appService.getapi();
  // }
  // app.get('/api', (req, res) => res.send('Hello World!'));
}
