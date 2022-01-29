import { ArrayTwoOrMore } from 'src/types/helper';

export type PollOption = { name: string; numberOfVotes: number };

export class CreatePollDto {
  name: string;
  ownerID: string;
  options: PollOption[];
  // options: ArrayTwoOrMore<PollOptions>;
}
