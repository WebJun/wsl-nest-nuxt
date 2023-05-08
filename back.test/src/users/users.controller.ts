import { Get, Post, Put, Delete } from '@nestjs/common';
import { Controller, Body, Param, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async index(): Promise<User[]> {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    return await this.userService.findAll();
  }
  @Get(':id')
  async show(@Param('id') id: number): Promise<User> {
    return await this.userService.findOne(id);
  }
  @Post()
  async store(@Body() user: User): Promise<User> {
    console.log(user);
    return await this.userService.create(user);
  }
  @Put(':id')
  async update(@Param('id') id: number, @Body() user: User): Promise<User> {
    return await this.userService.update(id, user);
  }
  @Delete(':id')
  @HttpCode(204)
  async destroy(@Param('id') id: number) {
    return await this.userService.destroy(id);
  }
}
