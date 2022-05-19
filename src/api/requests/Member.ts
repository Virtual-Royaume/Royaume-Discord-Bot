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