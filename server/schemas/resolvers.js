const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  // Query is a special type of GraphQL type that we'll use to fetch user data.
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          // populate the users savedBooks
          .populate("savedBooks");
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
  // Mutation is a special type of GraphQL type that we'll use to make changes to data.
  Mutation: {
    // login is a mutation that will execute the loginUser query set up using Apollo Server.
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    // addUser is a mutation that will execute the addUser query set up using Apollo Server.
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    // saveBook is a mutation that will execute the saveBook query set up using Apollo Server.
    saveBook: async (parent, { bookInput }, context) => {
      console.log(bookInput);
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookInput } },
          { new: true }
        );

        return updatedUser;
      }

      throw AuthenticationError;
    },

    // removeBook is a mutation that will execute the removeBook query set up using Apollo Server.
    removeBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: args } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
