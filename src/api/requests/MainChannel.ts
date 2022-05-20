import { gql } from "graphql-request";

export const addChannel = gql`
    mutation AddChannel($channelId: ID!, $category: String!){
        addChannel(channelId: $channelId, category: $category)
    }
`;

export const removeChannel = gql`
    mutation RemoveChannel($channelId: ID!){
        removeChannel(channelId: $channelId)
    }
`;

export const getChannels = gql`
    query GetChannels {
        channels {
            channelId
            category
        }
    }
`;