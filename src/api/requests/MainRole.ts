import { gql } from "graphql-request";
import { MainRole } from "$core/api/Schema";

export type AddRoleType = { addRole: boolean };
export type AddRoleVariables = {
    roleId: string;
    category: string;
};
export const addRole = gql`
    mutation($roleId: ID!, $category: String!){
        addRole(roleId: $roleId, category: $category)
    }
`;

export type RemoveRoleType = { removeRole: boolean };
export type RemoveRoleVariables = {
    roleId: string;
};
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