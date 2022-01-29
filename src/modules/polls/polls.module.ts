import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Poll, PollSchema } from '../../schemas/poll.schema';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Poll.name, schema: PollSchema }]),
  ],
  controllers: [PollsController],
  providers: [PollsService],
})
export class PollsModule {}
