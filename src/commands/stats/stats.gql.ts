import { graphql } from "#/utils/request";

export const getServerActivityHistory = graphql(`
  query getServerActivityHistory($historyCount: Int!) {
    serverActivity(historyCount: $historyCount) {
      date
      voiceMinute
      messageCount
      memberCount
    }
  }
`);