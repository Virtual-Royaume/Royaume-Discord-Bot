import { graphql } from "#/utils/request";

export const getMembersTier = graphql(`
  query getMemberTierForTaskGame {
    members {
      _id
      activity {
        tier
      }
    }
  }
`);