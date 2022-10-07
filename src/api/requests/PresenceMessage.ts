import { PresenceMessage, PresenceType } from "$core/api/Schema";

export type GetPresenceMessagesType = { presenceMessages: PresenceMessage[] };
export const getPresenceMessages = `
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
export const addPresenceMessage = `
    mutation($type: PresenceType!, $text: String!) {
        addPresenceMessage(type: $type, text: $text)
    }
`;

export type RemovePresenceMessageType = { removePresenceMessage: boolean };
export type RemovePresenceMessageVariables = {
    id: string;
};
export const removePresenceMessage = `
    mutation($id: ID!){
        removePresenceMessage(id: $id)
    }
`;