import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
// Import ApolloProvider and ApolloClient
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: "/graphql",
});
// authLink middleware to set the request headers for every request to the API
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
// client instance of ApolloClient to make requests to the server
const client = new ApolloClient({
  // Set up our client to execute the authLink middleware prior to making the request to the API server
  link: authLink.concat(httpLink),
  // Set up our client to cache data locally
  cache: new InMemoryCache(),
});

function App() {
  return (
    // Wrap the entire app in the ApolloProvider component and pass in the client instance as the prop
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
