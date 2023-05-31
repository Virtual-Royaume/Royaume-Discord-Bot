import { graphql } from "$core/utils/request/graphql/code-gen";

export const createMember = graphql(`
    mutation createMember($id: ID!, $username: String!, $profilePicture: String!){
        createMember(id: $id, username: $username, profilePicture: $profilePicture){
            _id
        }
    }
`);

export const setAlwaysOnServer = graphql(`
    mutation setAlwaysOnServer($id: ID!, $value: Boolean!){
        updateMember(id: $id, input: {
            isOnServer: $value
        })
    }
`);

export const setUsernameAndProfilePicture = graphql(`
    mutation setUsernameAndProfilePicture($id: ID!, $username: String!, $profilePicture: String!){
        updateMember(id: $id, input: {
            username: $username
            profilePicture: $profilePicture
        })
    }
`);

export const setBirthday = graphql(`
    mutation setBirthday($id: ID!, $date: Date!){
        updateMember(id: $id, input: {
            birthday: $date
        })
    }
`);

export const incChannelMessage = graphql(`
    mutation incChannelMessage($id: ID!, $channelId: ID!){
        incMemberDiscordActivityChannel(id: $id, channelId: $channelId)
    }
`);

export const incVoiceMinute = graphql(`
    mutation incVoiceMinute($id: ID!){
        incMemberDiscordVoiceMinute(id: $id)
    }
`);

export const getMember = graphql(`
    query getMember($id: ID!){
        member(id: $id) {
          _id
          username
          profilePicture
          birthday
          isOnServer
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
              count
              progress
            }
          }
        }
      }
`);

export const getMembersTier = graphql(`
    query getMemberTier {
        members {
            _id
            activity {
                tier
            }
        }
    }
`);

export const getMembersOnServerStatus = graphql(`
    query getMemberOnServerStatus {
        members {
            _id
            username
            isOnServer
        }
    }
`);

export const getBirthdays = graphql(`
    query getBirthdays {
        members {
            _id
            username
            birthday
            profilePicture
        }
    }
`);

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

export const getMonthActivity = graphql(`
    query getMonthActivity {
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

export const getMemberActivityTier = graphql(`
    query getMemberActivityTier($memberId: ID!) {
        member(id: $memberId) {
            activity {
                tier
            }
        }
    }
`);