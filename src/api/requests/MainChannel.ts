import { gql } from "graphql-request";
import { MainChannel } from "$core/api/Schema";

export type AddChannelType = { addChannel: boolean };
export const addChannel = gql`
    mutation($channelId: ID!, $category: String!){
        addChannel(channelId: $channelId, category: $category)
    }
`;

export type RemoveChannelType = { removeChannel: boolean };
export const removeChannel = gql`
    mutation($channelId: ID!){
        removeChannel(channelId: $channelId)
    }
`;

export type GetChannelsType = { channels: MainChannel[] };
export const getChannels = gql`
    query {
        channels {
            channelId
            category
        }
    }
`;