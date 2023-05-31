import { graphql } from "#/utils/request";

export const getChannels = graphql(`
  query getChannels {
    channels {
      channelId
      category
    }
  }
`);