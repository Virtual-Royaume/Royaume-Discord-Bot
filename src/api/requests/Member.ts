import { gql } from "graphql-request";

export const createMember = gql`
    mutation CreateMember($id: ID!, $username: String!, $profilPicture: String!){
        createMember(id: $id, username: $username, profilPicture: $profilPicture){
            _id
        }
    }
`;