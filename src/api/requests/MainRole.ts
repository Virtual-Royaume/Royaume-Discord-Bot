import { gql } from "graphql-request";

export const addRole = gql`
    mutation AddRole($roleId: ID!, $category: String!){
        addRole(roleId: $roleId, category: $category)
    }
`;

export const removeRole = gql`
    mutation RemoveRole($roleId: ID!){
        removeRole(roleId: $roleId)
    }
`;

export const getRoles = gql`
    query GetRoles {
        roles {
            roleId
            category
        }
    }
`;