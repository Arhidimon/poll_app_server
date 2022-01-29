import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from '../../schemas/user.schema';

// This should be a real class/interface representing a user entity
// export type User = any;

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async userExists(username: string): Promise<boolean> {
    return (await this.userModel.count({ username }).exec()) > 0;
    // return this.users.find((user) => user.username === username);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).lean().exec();
  }
}
