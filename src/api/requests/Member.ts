import { gql } from "graphql-request";

const createMember = gql`
    mutation CreateMember($createMemberId: ID!, $username: String!, $profilPicture: String!){
        createMember(id: $createMemberId, username: $username, profilPicture: $profilPicture){
            _id
        }
    }
`;