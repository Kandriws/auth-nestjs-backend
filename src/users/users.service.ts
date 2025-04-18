import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';

import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (user) {
      throw new NotFoundException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return UserMapper.toResponseUserDto(newUser);
  }

  async findOne(where: FindOneOptions<User>): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne(where);
    if (!user) {
      throw new NotFoundException(
        `User not found with criteria: ${JSON.stringify(where)}`,
      );
    }
    return UserMapper.toResponseUserDto(user);
  }

  async findOneFull(where: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne(where);
    if (!user) {
      throw new NotFoundException(
        `User not found with criteria: ${JSON.stringify(where)}`,
      );
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<ResponseUserDto | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    return UserMapper.toResponseUserDto(user);
  }

  async update(id: string, updates: UpdateUserDto): Promise<ResponseUserDto> {
    const user = await this.userRepository.preload({ id, ...updates });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userRepository.save(user);
    return UserMapper.toResponseUserDto(user);
  }

  async updateHashedRefreshToken(
    id: string,
    hashedRefreshToken: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    user.hashedRefreshToken = hashedRefreshToken;
    return await this.userRepository.save(user);
  }
}
