export type Proposal = {
  upVote: ProposalSection;
  downVote: ProposalSection;
}

export type ProposalSection = {
  emoji: string;
  count: number;
}