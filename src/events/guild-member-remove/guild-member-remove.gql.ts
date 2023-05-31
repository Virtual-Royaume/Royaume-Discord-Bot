import { graphql } from "#/utils/request";

export const setAlwaysOnServer = graphql(`
  mutation setAlwaysOnServerForEventRemove($id: ID!, $value: Boolean!) {
    updateMember(id: $id, input: {
      isOnServer: $value
    })
  }
`);