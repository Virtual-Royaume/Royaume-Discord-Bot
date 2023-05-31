import { graphql } from "#/utils/request";

export const getMembersTier = graphql(`
  query getMemberTierForTask {
    members {
      _id
      activity {
        tier
      }
    }
  }
`);