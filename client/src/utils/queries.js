import { gql } from "@apollo/client";

export const GET_ME = gql`
  query me {
    me {
      _id
      bookCount
      email
      savedBooks {
        authors
        bookId
        image
        description
        link
        title
      }
      username
    }
  }
`;
