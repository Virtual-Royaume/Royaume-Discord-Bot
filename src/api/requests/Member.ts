import { ChannelMessageCount, DiscordActivity, DiscordMessageActivity, Member } from "$core/api/Schema";

export type CreateMemberType = { createMember: Pick<Member, "_id"> };
export type CreateMemberVariables = {
    id: string;
    username: string;
    profilePicture: string;
};
export const createMember = `
    mutation($id: ID!, $username: String!, $profilePicture: String!){
        createMember(id: $id, username: $username, profilePicture: $profilePicture){
            _id
        }
    }
`;

export type SetAlwaysOnServerType = { updateMember: boolean };
export type SetAlwaysOnServerVariables = {
    id: string;
    value: boolean;
};
export const setAlwaysOnServer = `
    mutation($id: ID!, $value: Boolean!){
        updateMember(id: $id, input: {
            isOnServer: $value
        })
    }
`;

export type SetUsernameAndprofilePictureType = { updateMember: boolean };
export type SetUsernameAndprofilePictureVariables = {
    id: string;
    username: string;
    profilePicture: string;
};
export const setUsernameAndprofilePicture = `
    mutation($id: ID!, $username: String!, $profilePicture: String!){
        updateMember(id: $id, input: {
            username: $username
            profilePicture: $profilePicture
        })
    }
`;

export type SetBirthdayType = { updateMember: boolean };
export type SetBirthdayVariable = {
    id: string;
    date: number;
};
export const setBirthday = `
    mutation($id: ID!, $date: Date!){
        updateMember(id: $id, input: {
            birthday: $date
        })
    }
`;

export type IncChannelMessageType = { incMemberDiscordActivityChannel: number };
export type IncChannelMessageVariables = {
    id: string;
    channelId: string;
};
export const incChannelMessage = `
    mutation($id: ID!, $channelId: ID!){
        incMemberDiscordActivityChannel(id: $id, channelId: $channelId)
    }
`;

export type IncVoiceMinuteType = { incMemberDiscordVoiceMinute: number };
export type IncVoiceMinuteVariables = {
    id: string;
}
export const incVoiceMinute = `
    mutation($id: ID!){
        incMemberDiscordVoiceMinute(id: $id)
    }
`;

export type GetMemberType = { member: Member };
export type GetMemberVariables = {
    id: string;
}
export const getMember = `
    query($id: ID!){
        member(id: $id){
            _id
            username
            profilePicture
            isOnServer
            birthday
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

export type GetMembersTierType = { members: (Pick<Member, "_id"> & {
    activity: Pick<DiscordActivity, "tier">
})[] };
export const getMembersTier = `
    query {
        members {
            _id
            activity {
                tier
            }
        }
    }
`;

export type GetMembersOnServerStatusType = {
    members: Pick<Member, "_id" | "username" | "isOnServer">[]
};
export const getMembersOnServerStatus = `
    query {
        members {
            _id
            username
            isOnServer
        }
    }
`;

export type GetBirthdaysType = {
    members: Pick<Member, "_id" | "username" | "birthday" | "profilePicture">[]
};
export const getBirthdays = `
    query {
        members {
            _id
            username
            birthday
            profilePicture
        }
    }
`;

export type GetVoiceTimeType = { members: (Pick<Member, "_id" | "username"> & {
    activity: Pick<DiscordActivity, "voiceMinute">
})[] };
export const getVoiceTime = `
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
export const getMonthMessageCount = `
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
export const getMonthVoiceMinute = `
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
export const getMonthActivity = `
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
export const getTotalMessageCount = `
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
export const getChannelMessageCount = `
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

export type GetMemberActivityTierType = { member: Member };
export type GetMemberActivityTierVariables = {
    memberId: string;
}
export const getMemberActivityTier = `
    query Member($memberId: ID!) {
        member(id: $memberId) {
            activity {
                tier
            }
        }
    }
`;