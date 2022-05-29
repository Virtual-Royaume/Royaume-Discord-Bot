import { gql } from "graphql-request";

export const getPresenceMessages = gql`
    query GetPresenceMessages {
        presenceMessages {
            _id
            type
            text
        }
    }
`;