import { graphql } from "#/utils/request";

export const getMonthVoiceMinute = graphql(`
  query getMonthVoiceMinute {
    members {
      _id
      username
      activity {
        monthVoiceMinute
      }
    }
  }
`);