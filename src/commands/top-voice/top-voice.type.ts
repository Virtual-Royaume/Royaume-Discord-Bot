export type MembersData = {
  username: string;
  voiceMinute: number;
}

export type Page = {
  page: number;
  maxPage: number;
  data: MembersData[]
}