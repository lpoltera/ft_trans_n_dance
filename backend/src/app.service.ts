import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'hello';
  }
  getapi(): string {
    return 'getapi call';
  }
}
