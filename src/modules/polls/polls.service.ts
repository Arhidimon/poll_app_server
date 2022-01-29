import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Poll, PollDocument } from '../../schemas/poll.schema';
import * as mongoose from 'mongoose';
// import { Poll } from './entities/poll.entity';

@Injectable()
export class PollsService {
  constructor(@InjectModel(Poll.name) private pollModel: Model<PollDocument>) {}

  //This action adds a new poll
  async create(createPollDto: CreatePollDto): Promise<Poll> {
    console.log(`create dto ${JSON.stringify(createPollDto)}`);
    const createdPoll = new this.pollModel(createPollDto);
    return createdPoll.save();
  }

  async vote(pollID, userID, option) {
    // const aggregation = await this.pollModel
    //   .aggregate()
    //   .match({ _id: new mongoose.Types.ObjectId(pollID) })
    //   .project({ voting: { $size: '$voting' } })
    //   .exec();

    const poll = await this.pollModel.findById(pollID).exec();
    if (option >= poll.options.length || option < 0) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    const voterIndex = poll.voting.findIndex((vote) => vote.voterID == userID);
    if (voterIndex !== -1) {
      if (!(poll.voting[voterIndex].option === option)) {
        poll.options[poll.voting[voterIndex].option].numberOfVotes--;
        poll.options[option].numberOfVotes++;
        poll.voting[voterIndex].option = option;
      }
    } else {
      poll.voting.push({
        voterID: userID,
        option,
      });
      poll.options[option].numberOfVotes++;
    }
    await poll.save();
    const myVote = poll.voting.find((vote) => vote.voterID == userID) || null;
    return {
      id: poll._id,
      name: poll.name,
      options: poll.options,
      owner: poll.ownerID,
      votes: poll.voting.length,
      selected: myVote ? myVote.option : null,
    };
  }

  // This action returns all polls
  async findAll(user) {
    console.log(`findOne user ${user}`);
    //TODO optimize db query
    const polls = await this.pollModel.find().lean().exec();
    console.log(`polls ${JSON.stringify(polls)}`);
    if (user.userID) {
      return polls.map((poll) => {
        const myVote =
          poll.voting.find((vote) => vote.voterID == user.userID) || null;
        return {
          id: poll._id,
          name: poll.name,
          options: poll.options,
          owner: poll.ownerID,
          votes: poll.voting.length,
          selected: myVote ? myVote.option : null,
        };
      });
    } else {
      return polls.map((poll) => ({
        id: poll._id,
        name: poll.name,
        options: poll.options,
        owner: poll.ownerID,
        votes: poll.voting.length,
      }));
    }
  }
  //This action returns a #${id} poll
  async findOne(id: string, user) {
    // return this.pollModel.findById(id).exec();
    const poll = await this.pollModel.findById(id).lean().exec();
    if (user.userID) {
      const myVote =
        poll.voting.find((vote) => vote.voterID == user.userID) || null;
      return {
        id: poll._id,
        name: poll.name,
        options: poll.options,
        owner: poll.ownerID,
        votes: poll.voting.length,
        selected: myVote ? myVote.option : null,
      };
    } else {
      return {
        id: poll._id,
        name: poll.name,
        options: poll.options,
        owner: poll.ownerID,
        votes: poll.voting.length,
      };
    }
    return poll;
    // return this.polls[id];
  }

  update(id: number, updatePollDto: UpdatePollDto) {
    return `This action updates a #${id} poll`;
  }

  async remove(
    userID: mongoose.Types.ObjectId,
    pollID: mongoose.Types.ObjectId,
  ) {
    const poll = await this.pollModel.findById(pollID, 'ownerID').exec();
    if (!poll) {
      return `Poll #${pollID} not found!`;
    }
    const ownerID = poll.ownerID;
    if (ownerID == userID) {
      await this.pollModel.findByIdAndDelete(pollID);
      return `Poll #${pollID} removed`;
    } else {
      return 'You must be owner of poll to remove it';
    }
  }
}
