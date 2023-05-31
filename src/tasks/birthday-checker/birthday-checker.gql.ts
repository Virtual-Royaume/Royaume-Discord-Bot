import { graphql } from "#/utils/request";

export const getBirthdays = graphql(`
  query getBirthdaysForTask {
    members {
      _id
      username
      birthday
      profilePicture
    }
  }
`);