import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }
    createUser(username: string, password: string): Promise<User> {
        const user = new User();
        user.username = username;
        user.password = password;
        return this.usersRepository.save(user);
    }
   
    getUser(username: string): Promise<User> {
        return this.usersRepository.findOneBy({ username: username });
    }

}