import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  Put,
  Body,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';

/* import { UserService } from '../services/user.service';
import { UserUpdate } from '../dto/user-update.dto';
import { JWTAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SessionAuthGuard } from '../../auth/guards/session-auth.guard'; */
import { UsersService } from '../users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { ResponseUserDto } from '../dto/response-user.dto';

@Controller('users')
//@UseGuards(JWTAuthGuard, SessionAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  get(@Param('id', new ParseUUIDPipe()) id: string): Promise<ResponseUserDto> {
    return this.userService.findOne({ where: { id } });
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    return this.userService.update(id, updateUserDto);
  }
}
