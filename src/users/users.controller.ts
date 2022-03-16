import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.strategy';
import { CustomExceptionFilter } from '../commons/exceptions-filters/custom-exception.filter';
import { UserId } from './domain/user-id';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseFilters(new CustomExceptionFilter())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('search')
  search(
    @Query('username') username: string,
    @Query('firstname') firstname: string,
    @Query('lastname') lastname: string,
  ) {
    return this.usersService.search(username, firstname, lastname);
  }

  @Get(':id')
  findOne(@Param('id') id: UserId) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: UserId, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: UserId) {
    return this.usersService.remove(id);
  }
}
