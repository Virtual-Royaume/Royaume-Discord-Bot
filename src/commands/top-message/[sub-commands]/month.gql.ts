import { graphql } from "#/utils/request";

export const getMonthMessageCount = graphql(`
  query getMonthMessageCount {
    members {
      _id
      username
      activity {
        messages {
          monthCount
        }
      }
    }
  }
`);