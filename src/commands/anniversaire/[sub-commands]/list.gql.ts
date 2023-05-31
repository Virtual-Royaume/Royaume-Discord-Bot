import { graphql } from "#/utils/request";

export const getBirthdays = graphql(`
  query getBirthdaysForList {
    members {
      _id
      username
      birthday
      profilePicture
    }
  }
`);