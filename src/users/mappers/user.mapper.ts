import { Injectable } from '@nestjs/common';
import { ResponseUserDto } from '../dto/response-user.dto';
import { User } from '../entities/user.entity';
import { ResponseUserWithHashDto } from '../dto/response-user-with-hash.dto';

@Injectable()
export class UserMapper {
  static toResponseUserDto(user: User): ResponseUserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toResponseUserWithHashDto(user: User): ResponseUserWithHashDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      hashedRefreshToken: user.hashedRefreshToken,
    };
  }

  static toEntity(createUserDto: ResponseUserDto): User {
    const user = new User();
    user.id = createUserDto.id;
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.createdAt = createUserDto.createdAt;
    user.updatedAt = createUserDto.updatedAt;
    return user;
  }
}
