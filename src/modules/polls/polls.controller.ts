import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ArrayTwoOrMore } from 'src/types/helper';
import * as mongoose from 'mongoose';
import { JwtAnonymousAuthGuard } from '../auth/jwt-anonymous.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  //TODO fix any (add CusromRequest type)
  create(
    @Body('options') options: string[],
    @Body('name') name: string,
    @Req() request: any,
  ) {
    const createPollDto: CreatePollDto = {
      options: options.map((option) => ({ name: option, numberOfVotes: 0 })),
      ownerID: request.user.userID,
      name,
    };
    console.log(request.user.userID);
    return this.pollsService.create(createPollDto);
  }

  @UseGuards(JwtAnonymousAuthGuard)
  @Get()
  findAll(@Req() request: any) {
    return this.pollsService.findAll(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/vote')
  vote(@Param('id') id: string, @Req() request: any, @Body('option') option) {
    return this.pollsService.vote(id, request.user.userID, option);
  }

  @UseGuards(JwtAnonymousAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: any) {
    console.log(`request.user ${request.user} ${JSON.stringify(request.user)}`);
    return this.pollsService.findOne(id, request.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto) {
    return this.pollsService.update(+id, updatePollDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') pollID: mongoose.Types.ObjectId, @Req() request: any) {
    return this.pollsService.remove(request.user.userID, pollID);
  }
}
