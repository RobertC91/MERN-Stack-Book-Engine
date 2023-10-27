export const LOGIN_USER =`
mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password){
            token
            user {
                _id
                username
            }
        }
    }
`;

export const ADD_USER = `
    mutation addUser($username: String!, $email: String!, $password: String!){
    addUser(username: $username, email: $email, password: $password){
        token
        user {
            _id
            username
        }
    }
};`

export const SAVE_BOOK = `
    mutation saveBook ($input: BookInput!){
        saveBook(input: $input){
            _id
            username
            bookCount
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    };`

export const REMOVE_BOOK = `
    mutation removeBook($bookId: STRING!) {
    removeBook(bookId: $bookId) {
        _id
        username
        bookCount
        savedBooks {
            bookId
            authors
            description
            title
            image
            link
        }
    }
};`