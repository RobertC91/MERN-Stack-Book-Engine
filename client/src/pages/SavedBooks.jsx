import { Container, Card, Button, Row, Col } from "react-bootstrap";

import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

//Import useQuery and useMutation hooks from @apollo/client to use in SavedBooks component 
import { useQuery, useMutation } from "@apollo/client";
// Import the GET_ME query from the queries.js file
import { GET_ME } from "../utils/queries";
// Import the REMOVE_BOOK mutation from the mutations.js file
import { REMOVE_BOOK } from "../utils/mutations";

const SavedBooks = () => {
  // use useQuery hook to make query request passing in the GET_ME query as an argument
  const { loading, data } = useQuery(GET_ME);
  // use useMutation hook to make mutation request passing in the REMOVE_BOOK mutation as an argument
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  // create constant to hold the data returned from the query
  const userData = data?.me || {};
  console.log(userData);

  // create loading screen
  if (loading) {
    return <div>Loading...</div>;
  }

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    // get token for logged in user
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // use removeBook mutation to delete book from database
      const { data } = await removeBook({
        // pass in the bookId variable as an argument to the mutation
        variables: { bookId },
      });

      if (!data) {
        throw new Error("Book could not be deleted!");
      }
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
