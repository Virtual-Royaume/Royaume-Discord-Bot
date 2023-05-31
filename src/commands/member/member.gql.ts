import { graphql } from "#/utils/request";

export const getMember = graphql(`
  query getMemberForCommand($id: ID!) {
    member(id: $id) {
      _id
      birthday
      activity {
        tier
        voiceMinute
        monthVoiceMinute
        messages {
          totalCount
          monthCount
          perChannel {
            channelId
            messageCount
          }
        }
        points {
          progress
        }
      }
    }
  }
`);