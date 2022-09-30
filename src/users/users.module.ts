import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from "@nestjs/mongoose"
// import { UserSchema } from "./users.model"
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User])
    // MongooseModule.forFeature([{ name: "user", schema: UserSchema }])
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}