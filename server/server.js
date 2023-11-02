const express = require('express');
const path = require('path');
// Import the ApolloServer class
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');

// Import the two parts of a GraphQL schema
const { typeDefs, resolvers } = require('./schemas');
// Import the connection to the database
const db = require('./config/connection');

// set up port
const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express(); 

// Function to start the Apollo server
const startApolloServer = async () => {
  await server.start();
  
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  
  // Use the Express application as middleware in Apollo server with the GraphQL path set to /graphql
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // Serve up static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Wildcard GET route for delivering the client-side application
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Start the Apollo server and log the port to the console
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();