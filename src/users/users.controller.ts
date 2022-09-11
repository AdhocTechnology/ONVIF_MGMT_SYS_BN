import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('/signup')
    async createUser(
        @Body() body,
    ): Promise<User> {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(body.password, saltOrRounds);
        const result = await this.usersService.createUser(
            body.username,
            hashedPassword,
        );
        return result;
    }
}