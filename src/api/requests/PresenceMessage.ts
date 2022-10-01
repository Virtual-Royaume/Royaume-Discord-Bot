import { gql } from "graphql-request";
import { PresenceMessage, PresenceType } from "$core/api/Schema";

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
export type AddPresenceMessageVariables = {
    type: PresenceType;
};
export const addPresenceMessage = gql`
    mutation($type: PresenceType!, $text: String!) {
        addPresenceMessage(type: $type, text: $text)
    }
`;

export type RemovePresenceMessageType = { removePresenceMessage: boolean };
export type RemovePresenceMessageVariables = {
    id: string;
};
export const removePresenceMessage = gql`
    mutation($id: ID!){
        removePresenceMessage(id: $id)
    }
`;