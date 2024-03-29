import type { MembersData, Page } from "./top-voice.type";
import { formatMinutes } from "#/utils/function/date";
import { msgParams } from "#/utils/message";

export const getPage = (members: MembersData[], memberPerPage: number, page: number): Page => {
  const maxPage = Math.ceil(members.length / memberPerPage);
  page = page > maxPage ? maxPage : page;

  return {
    page,
    maxPage,
    data: members.slice(page * memberPerPage - memberPerPage, page * memberPerPage)
  };
};

export const formatPage = (page: Page, memberPerPage: number, format: string): string => {
  const members = page.data;
  let message = "";

  for (let i = 0; i < members.length; i++) {
    const member = members[i];

    message += msgParams(
      format,
      [
        i + 1 + (page.page - 1) * memberPerPage,
        member.username,
        formatMinutes(member.voiceMinute)
      ]
    );
  }

  return message;
};