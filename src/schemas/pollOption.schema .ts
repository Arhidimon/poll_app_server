import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class PollOption {
  @Prop(String)
  name: string;

  @Prop({ type: Number, default: 0 })
  numberOfVotes: number;
}

export const PollOptionSchema = SchemaFactory.createForClass(PollOption);
