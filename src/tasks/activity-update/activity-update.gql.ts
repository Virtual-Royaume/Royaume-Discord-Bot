import { graphql } from "#/utils/request";

export const incVoiceMinute = graphql(`
  mutation incVoiceMinute($id: ID!) {
    incMemberDiscordVoiceMinute(id: $id)
  }
`);

export const setMemberCount = graphql(`
  mutation setMemberCount($count: Int!) {
    setServerActivityMemberCount(count: $count)
  }
`);