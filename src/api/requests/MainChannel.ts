import { MainChannel } from "$core/api/Schema";

export type AddChannelType = { addChannel: boolean };
export type AddChannelVariables = {
    channelId: string;
    category: string;
};
export const addChannel = `
    mutation($channelId: ID!, $category: String!){
        addChannel(channelId: $channelId, category: $category)
    }
`;

export type RemoveChannelType = { removeChannel: boolean };
export type RemoveChannelVariables = {
    channelId: string;
}
export const removeChannel = `
    mutation($channelId: ID!){
        removeChannel(channelId: $channelId)
    }
`;

export type GetChannelsType = { channels: MainChannel[] };
export const getChannels = `
    query {
        channels {
            channelId
            category
        }
    }
`;