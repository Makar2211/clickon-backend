import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/guards/auth.guard';

@Controller()
export class AppController {
  constructor() { }


  @UseGuards(AuthGuard)
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
