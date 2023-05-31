import { graphql } from "$core/utils/request/graphql/code-gen";

export const addRole = graphql(`
    mutation addRole($roleId: ID!, $category: String!){
        addRole(roleId: $roleId, category: $category)
    }
`);

export const removeRole = graphql(`
    mutation removeRole($roleId: ID!){
        removeRole(roleId: $roleId)
    }
`);

export const getRoles = graphql(`
    query getRoles {
        roles {
            roleId
            category
        }
    }
`);