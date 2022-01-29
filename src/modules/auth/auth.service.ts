import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { use } from 'passport';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log(`validateUser username ${username} password ${password}`);
    const user = await this.usersService.findOne(username);
    console.log(`validateUser ${JSON.stringify(user)}`);
    const match = await bcrypt.compare(password, user.saltedPasswordHash);

    if (match) {
      // const { saltedPasswordHash, ...rest } = user;
      // console.log(`validateUser rest ${JSON.stringify(rest)}`);
      console.log(`validateUser user ${JSON.stringify(user)}`);
      return { username: user.username, email: user.email, userID: user._id };
    }
    return null;
  }

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<any> {
    console.log(`createUser ${username} ${password}`);
    if (await this.usersService.userExists(username)) {
      return null;
    }
    const saltWithHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await this.usersService.create({
      username,
      email,
      saltedPasswordHash: saltWithHash,
    });

    return {
      username: user.username,
      email: user.email,
      userID: user._id,
    };
  }

  async login(user: any) {
    console.log(`user ${JSON.stringify(user)}`);
    const payload = {
      username: user.username,
      email: user.email,
      userID: user.userID,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
