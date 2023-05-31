import { graphql } from "#/utils/request";

export const incChannelMessage = graphql(`
  mutation incChannelMessage($id: ID!, $channelId: ID!) {
    incMemberDiscordActivityChannel(id: $id, channelId: $channelId)
  }
`);