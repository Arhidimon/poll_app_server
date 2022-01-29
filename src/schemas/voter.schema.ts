import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import * as mongoose from 'mongoose';

// export type Voter = { voterID: User; option: number };

@Schema({ _id: false })
export class Voter {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  voterID: mongoose.Types.ObjectId;

  @Prop(Number)
  option: number;
}

export const VoterSchema = SchemaFactory.createForClass(Voter);
