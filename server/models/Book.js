const { Schema } = require('mongoose');

// Create book schema to use in Book model for MongoDB
const bookSchema = new Schema({
  authors: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },

  bookId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
});

module.exports = bookSchema;
