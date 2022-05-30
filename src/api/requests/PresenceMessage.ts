import { gql } from "graphql-request";
import { PresenceMessage } from "../Schema";

export type GetPresenceMessagesType = { presenceMessages: PresenceMessage[] };
export const getPresenceMessages = gql`
    query {
        presenceMessages {
            _id
            type
            text
        }
    }
`;