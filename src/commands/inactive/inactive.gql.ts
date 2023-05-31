import { graphql } from "#/utils/request";

export const getMember = graphql(`
  query getMemberForInactiveCommand($id: ID!){
    member(id: $id) {
      _id
      activity {
        tier
        voiceMinute
        monthVoiceMinute
        messages {
          totalCount
          monthCount
        }
      }
    }
  }
`);

export const getMonthActivity = graphql(`
  query getMonthActivityForCommand {
    members {
      _id
      username
      activity {
        monthVoiceMinute
        messages {
          monthCount
        }
      }
    }
  }
`);