// typeDefs.js is the schema file that defines the necessary Query and Mutation types, as well as any custom types, for the application.
const typeDefs =`

    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }
    type Book {
        bookId: ID!
        authors: [String]
        description: String
        image: String
        link: String
        title: String
      }

    input BookInput {
        authors: [String]
        description: String
        title: String
        bookId: String
        image: String
        link: String
    }

    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookInput: BookInput): User
        removeBook(bookId: ID!): User
    }

    type Auth {
        token: ID!
        user: User
    }`;

    module.exports = typeDefs;