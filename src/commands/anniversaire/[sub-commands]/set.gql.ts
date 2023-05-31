import { graphql } from "#/utils/request";

export const setBirthday = graphql(`
  mutation setBirthday($id: ID!, $date: Date!) {
    updateMember(id: $id, input: {
      birthday: $date
    })
  }
`);