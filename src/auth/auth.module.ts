import { Module } from "@nestjs/common"
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from "../users/users.service";
import { MongooseModule } from "@nestjs/mongoose"
// import { UserSchema } from "../users/users.model"
import { LocalStrategy } from '../local.auth';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtConstants } from '../constants';
import { JwtStrategy } from '../jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({
    // secret: 'secretKey',
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '60s' },
  }),
    // MongooseModule.forFeature([{ name: "user", schema: UserSchema }])
    TypeOrmModule.forFeature([User])
  ],
  providers: [AuthService, UsersService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }