import { graphql } from "#/utils/request";

export const getRoles = graphql(`
  query getRoles {
    roles {
      roleId
      category
    }
  }
`);