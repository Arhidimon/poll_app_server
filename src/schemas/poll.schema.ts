import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ArrayTwoOrMore } from 'src/types/helper';
import { User } from './user.schema';
import * as mongoose from 'mongoose';
import { Voter, VoterSchema } from './voter.schema';
import { PollOption, PollOptionSchema } from './pollOption.schema ';

export type PollDocument = Poll & Document;

@Schema()
export class Poll {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  ownerID: mongoose.Types.ObjectId;

  @Prop()
  name: string;

  @Prop([{ required: true, type: PollOptionSchema }])
  options: PollOption[];

  @Prop([{ required: true, type: VoterSchema }])
  voting: Voter[];
}

export const PollSchema = SchemaFactory.createForClass(Poll);
