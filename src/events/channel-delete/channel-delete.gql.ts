import { graphql } from "#/utils/request";

export const removeChannel = graphql(`
  mutation removeChannel($channelId: ID!) {
    removeChannel(channelId: $channelId)
  }
`);