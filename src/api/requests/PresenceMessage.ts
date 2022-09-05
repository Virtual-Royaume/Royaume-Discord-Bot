import { gql } from "graphql-request";
import { PresenceMessage } from "$core/api/Schema";

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

export type AddPresenceMessageType = { addPresenceMessage: boolean };
export const addPresenceMessage = gql`
    mutation($type: PresenceType!, $text: String!) {
        addPresenceMessage(type: $type, text: $text)
    }
`;

export type RemovePresenceMessageType = { removePresenceMessage: boolean };
export const removePresenceMessage = gql`
    mutation($id: ID!){
        removePresenceMessage(id: $id)
    }
`;