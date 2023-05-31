import type { GetMonthActivityQuery } from "#/utils/request";
import { getMonthActivity } from "#/api/requests/member";
import { gqlRequest } from "#/utils/request";

export const getInactiveMembers = async(): Promise<GetMonthActivityQuery["members"] | null> => {
  const monthActivityQuery = await gqlRequest(getMonthActivity);

  if (!monthActivityQuery.ok) return null;

  const inactiveMembers = monthActivityQuery.value.members.filter(member => {
    const monthMessage = member.activity?.messages.monthCount;
    const monthVoice = member.activity?.monthVoiceMinute;

    return !monthMessage && !monthVoice;
  });

  return inactiveMembers;
};