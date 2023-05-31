import { graphql } from "#/utils/request";

export const setUsernameAndProfilePicture = graphql(`
  mutation setUsernameAndProfilePicture($id: ID!, $username: String!, $profilePicture: String!) {
    updateMember(id: $id, input: {
      username: $username
      profilePicture: $profilePicture
    })
  }
`);