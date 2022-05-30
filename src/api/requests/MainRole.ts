import { gql } from "graphql-request";
import { MainRole } from "../Schema";

export type AddRoleType = { addRole: boolean };
export const addRole = gql`
    mutation($roleId: ID!, $category: String!){
        addRole(roleId: $roleId, category: $category)
    }
`;

export type RemoveRoleType = { removeRole: boolean };
export const removeRole = gql`
    mutation($roleId: ID!){
        removeRole(roleId: $roleId)
    }
`;

export type GetRolesType = { roles: MainRole[] };
export const getRoles = gql`
    query {
        roles {
            roleId
            category
        }
    }
`;