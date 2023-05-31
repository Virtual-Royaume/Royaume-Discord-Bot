import { graphql } from "#/utils/request";

export const createMember = graphql(`
  mutation createMemberForEvent($id: ID!, $username: String!, $profilePicture: String!) {
    createMember(id: $id, username: $username, profilePicture: $profilePicture) {
      _id
    }
  }
`);

export const getMemberActivityTier = graphql(`
  query getMemberActivityTierEvent($memberId: ID!) {
    member(id: $memberId) {
      activity {
        tier
      }
    }
  }
`);

export const setAlwaysOnServer = graphql(`
  mutation setAlwaysOnServerForEventAdd($id: ID!, $value: Boolean!) {
    updateMember(id: $id, input: {
      isOnServer: $value
    })
  }
`);