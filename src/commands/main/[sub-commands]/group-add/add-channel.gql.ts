import { graphql } from "#/utils/request";

export const addChannel = graphql(`
  mutation addChannel($channelId: ID!, $category: String!) {
    addChannel(channelId: $channelId, category: $category)
  }
`);