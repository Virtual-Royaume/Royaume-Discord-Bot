export type MembersData = {
  username: string;
  messageCount: number;
}

export type Page = {
  page: number;
  maxPage: number;
  data: MembersData[];
}