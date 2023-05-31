import { graphql } from "#/utils/request";

export const getBirthdays = graphql(`
  query getBirthdaysForNext {
    members {
      _id
      username
      birthday
      profilePicture
    }
  }
`);