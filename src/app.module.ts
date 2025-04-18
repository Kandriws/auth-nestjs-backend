import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { envs } from './common/config';
@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.DB_HOST,
      port: +envs.DB_PORT,
      username: envs.DB_USERNAME,
      password: envs.DB_PASSWORD,
      database: envs.DB_NAME,
      autoLoadEntities: true,
      synchronize: envs.isDevelopment,
    }),
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
