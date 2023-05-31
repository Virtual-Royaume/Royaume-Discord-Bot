import { graphql } from "#/utils/request";

export const getPresenceMessages = graphql(`
    query getPresenceMessages {
        presenceMessages {
            _id
            type
            text
        }
    }
`);

export const addPresenceMessage = graphql(`
    mutation addPresenceMessage($type: PresenceType!, $text: String!) {
        addPresenceMessage(type: $type, text: $text)
    }
`);

export const removePresenceMessage = graphql(`
    mutation remoePresenceMessage($id: ID!){
        removePresenceMessage(id: $id)
    }
`);