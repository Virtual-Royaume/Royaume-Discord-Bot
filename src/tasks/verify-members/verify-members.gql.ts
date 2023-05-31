import { graphql } from "#/utils/request";

export const createMember = graphql(`
  mutation createMemberForTask($id: ID!, $username: String!, $profilePicture: String!) {
    createMember(id: $id, username: $username, profilePicture: $profilePicture) {
      _id
    }
  }
`);

export const setAlwaysOnServer = graphql(`
  mutation setAlwaysOnServerForTask($id: ID!, $value: Boolean!) {
    updateMember(id: $id, input: {
      isOnServer: $value
    })
  }
`);

export const getMember = graphql(`
  query getMemberForTask($id: ID!) {
    member(id: $id) {
      _id
    }
  }
`);

export const getMembersOnServerStatus = graphql(`
  query getMemberOnServerStatusForTask {
    members {
      _id
      username
      isOnServer
    }
  }
`);