import { gql } from "graphql-request";

export const createMember = gql`
    mutation CreateMember($id: ID!, $username: String!, $profilPicture: String!){
        createMember(id: $id, username: $username, profilPicture: $profilPicture){
            _id
        }
    }
`;

export const setAlwaysOnServer = gql`
    mutation SetAlwaysOnServer($id: ID!, $value: Boolean!){
        updateMember(id: $id, input: {
            isOnServer: $value
        })
    }
`;

export const setUsername = gql`
    mutation SetUsername($id: ID!, $username: String!){
        updateMember(id: $id, input: {
            username: $username
        })
    }
`;

export const incChannelMessage = gql`
    mutation IncChannelMessage($id: ID!, $channelId: ID!){
        incMemberDiscordActivityChannel(id: $id, channelId: $channelId)
    }
`;

export const incVoiceMinute = gql`
    mutation IncVoiceMinute($id: ID!){
        incMemberDiscordVoiceMinute(id: $id)
    }
`;

export const getMember = gql`
    query GetMember($id: ID!){
        member(id: $id){
            _id
            username
            profilPicture
            isOnServer
            activity {
            voiceMinute
                messages {
                    totalCount
                    monthCount
                    perChannel {
                        channelId
                        messageCount
                    }
                }
            }
        }
    }
`;

export const getVoiceTime = gql`
    query GetVoiceTimes {
        members {
            _id
            username
            activity {
                voiceMinute
            }
        }
    }
`;

export const getMonthMessageCount = gql`
    query GetMonthMessageCount {
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
`;

export const getTotalMessageCount = gql`
    query GetTotalMessageCount {
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
`;

export const getChannelMessageCount = gql`
    query GetChannelMessageCount {
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
`;