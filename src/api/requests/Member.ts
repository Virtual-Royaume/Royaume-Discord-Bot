import { gql } from "graphql-request";
import { ChannelMessageCount, DiscordActivity, DiscordMessageActivity, Member } from "../Schema";

export type CreateMemberType = { createMember: Pick<Member, "_id"> };
export const createMember = gql`
    mutation($id: ID!, $username: String!, $profilePicture: String!){
        createMember(id: $id, username: $username, profilePicture: $profilePicture){
            _id
        }
    }
`;

export type SetAlwaysOnServerType = { updateMember: boolean };
export const setAlwaysOnServer = gql`
    mutation($id: ID!, $value: Boolean!){
        updateMember(id: $id, input: {
            isOnServer: $value
        })
    }
`;

export type SetUsernameAndprofilePictureType = { updateMember: boolean };
export const setUsernameAndprofilePicture = gql`
    mutation($id: ID!, $username: String!, $profilePicture: String!){
        updateMember(id: $id, input: {
            username: $username
            profilePicture: $profilePicture
        })
    }
`;

export type IncChannelMessageType = { incMemberDiscordActivityChannel: boolean };
export const incChannelMessage = gql`
    mutation($id: ID!, $channelId: ID!){
        incMemberDiscordActivityChannel(id: $id, channelId: $channelId)
    }
`;

export type IncVoiceMinuteType = { incMemberDiscordVoiceMinute: boolean };
export const incVoiceMinute = gql`
    mutation($id: ID!){
        incMemberDiscordVoiceMinute(id: $id)
    }
`;

export type GetMemberType = { member: Member };
export const getMember = gql`
    query($id: ID!){
        member(id: $id){
            _id
            username
            profilePicture
            isOnServer
            activity {
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
            }
        }
    }
`;

export type GetMembersOnServerStatusType = { members: Pick<Member, "_id" | "username" | "isOnServer">[] };
export const getMembersOnServerStatus = gql`
    query {
        members {
            _id
            username
            isOnServer
        }
    }
`;

export type GetVoiceTimeType = { members: (Pick<Member, "_id" | "username"> & { 
    activity: Pick<DiscordActivity, "voiceMinute"> 
})[] };
export const getVoiceTime = gql`
    query {
        members {
            _id
            username
            activity {
                voiceMinute
            }
        }
    }
`;

export type GetMonthMessageCountType = { members: (Pick<Member, "_id" | "username"> & {
    activity: { messages: Pick<DiscordMessageActivity, "monthCount"> }
})[] };
export const getMonthMessageCount = gql`
    query {
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

export type GetMonthVoiceMinuteType = { members: (Pick<Member, "_id" | "username"> & {
    activity: Pick<DiscordActivity, "monthVoiceMinute">
})[] };
export const getMonthVoiceMinute = gql`
    query {
        members {
            _id
            username
            activity {
                monthVoiceMinute
            }
        }
    }
`;

export type GetMonthActivityType = { members: (Pick<Member, "_id" | "username"> & {
    activity: Pick<DiscordActivity, "monthVoiceMinute"> & {
        messages: Pick<DiscordMessageActivity, "monthCount">
    }
})[] };
export const getMonthActivity = gql`
    query {
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
`;

export type GetTotalMessageType = { members: (Pick<Member, "_id" | "username"> & {
    activity: {
        messages: Pick<DiscordMessageActivity, "totalCount">
    }
})[] };
export const getTotalMessageCount = gql`
    query {
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

export type GetChannelMessageCountType = { members: (Pick<Member, "_id" | "username"> & {
    activity: {
        messages: {
            perChannel: Pick<ChannelMessageCount, "channelId" | "messageCount">[]
        }
    }
})[] };
export const getChannelMessageCount = gql`
    query {
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