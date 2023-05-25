import { Controller, Get, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("user")
export class UserController {
  constructor(private readonly appService: AppService) {}

  @Get()
  me(): string {
    return "cool user";
  }

  @Put("create")
  create(): string {
    return "cool token"
  }
}
