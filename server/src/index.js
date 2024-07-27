const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const typeDefs = require("./typeDefs");
const mongoose = require("mongoose");
require("dotenv").config();
const resolvers = require("./resolvers");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req?.headers?.authorization;

    if (auth?.startsWith("Bearer ")) {
      const token = auth.substring(7);
      try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(id);

        return { currentUser };
      } catch (error) {
        console.error("JWT Verification Error:", error.message);
        console.log("Invalid token");
        return {};
      }
    }

    return {};
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
