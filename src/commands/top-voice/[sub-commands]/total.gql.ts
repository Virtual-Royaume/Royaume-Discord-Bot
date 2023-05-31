import { graphql } from "#/utils/request";

export const getVoiceTime = graphql(`
  query getVoiceTime {
    members {
      _id
      username
      activity {
        voiceMinute
      }
    }
  }
`);