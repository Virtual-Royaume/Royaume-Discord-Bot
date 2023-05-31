import { graphql } from "#/utils/request";

export const removeChannel = graphql(`
  mutation removeChannelForCommandRemove($channelId: ID!) {
    removeChannel(channelId: $channelId)
  }
`);