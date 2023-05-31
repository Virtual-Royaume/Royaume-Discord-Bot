import { graphql } from "#/utils/request";

export const getChannelMessageCount = graphql(`
  query getChannelMessageCount {
    members {
      _id
      username
      activity {
        messages {
          perChannel {
            channelId
            messageCount
          }
        }
      }
    }
  }
`);