import { getMonthActivity } from "$core/api/requests/member";
import { gqlRequest } from "$core/utils/request";
import { GetMonthActivityQuery } from "$core/utils/request/graphql/graphql";

export const getInactiveMembers = async(): Promise<GetMonthActivityQuery["members"] | null> => {
  const monthActivityQuery = await gqlRequest(getMonthActivity);

  if (!monthActivityQuery.success) return null;

  const inactiveMembers = monthActivityQuery.data.members.filter(member => {
    const monthMessage = member.activity?.messages.monthCount;
    const monthVoice = member.activity?.monthVoiceMinute;

    return !monthMessage && !monthVoice;
  });

  return inactiveMembers;
};