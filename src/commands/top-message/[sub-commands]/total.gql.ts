import { graphql } from "#/utils/request";

export const getTotalMessageCount = graphql(`
  query getTotalMessageCount {
    members {
      _id
      username
      activity {
        messages {
          totalCount
        }
      }
    }
  }
`);