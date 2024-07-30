const { GraphQLError } = require("graphql");
const User = require("./models/user");
const Roadmap = require("./models/roadmap");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const resolvers = {
  Query: {
    me: (root, args, context) => {
      const currentUser = context.currentUser;
      return currentUser;
    },
    allUsers: async () => {
      return User.find({});
    },
    allRoadmaps: async () => {
      return Roadmap.find({});
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const { username, password, isAdmin } = args;

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = new User({
        username,
        passwordHash,
        isAdmin,
      });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const { username, password } = args;
      const user = await User.findOne({ username });

      const passwordCorrect =
        user === null
          ? false
          : await bcrypt.compare(password, user.passwordHash);

      if (!(user && passwordCorrect)) {
        throw new GraphQLError("Wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    createRoadmap: async (root, args, context) => {
      const { title, description, image, sections } = args;
      const currentUser = context.currentUser;

      if (!currentUser || !currentUser.isAdmin) {
        throw new GraphQLError("Only admins can create roadmaps");
      }

      if (!title || !description || !image || !sections) {
        throw new GraphQLError("Malformed arguments");
      }

      const roadmapToSave = new Roadmap({
        title,
        description,
        image,
        sections,
      });

      return roadmapToSave.save();
    },
    enrollUser: async (root, args, context) => {
      const { roadmapId } = args;
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("Invalid Token");
      }

      const roadmap = await Roadmap.findById(roadmapId);
      if (!roadmap) {
        throw new GraphQLError("Roadmap not found");
      }

      const user = await User.findById(currentUser.id);
      if (!user) {
        throw new GraphQLError("User not found");
      }

      const isEnrolled = user.progress.some(
        (progress) => progress.roadmap.toString() === roadmapId
      );

      if (isEnrolled) {
        throw new GraphQLError("User already enrolled in this roadmap");
      }

      user.progress.push({ roadmap: roadmap._id, completedSections: [] });
      await user.save();

      return user
        .populate({
          path: "progress.roadmap",
          populate: { path: "sections" },
        })
        ;
    },
    completeSection: async (root, args, context) => {
      const { roadmapId, sectionId } = args;
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("Invalid Token");
      }

      const roadmap = await Roadmap.findById(roadmapId);

      if (!roadmap) {
        throw new GraphQLError("Roadmap not found");
      }

      const user = await User.findById(currentUser.id);
      if (!user) {
        throw new GraphQLError("User not found");
      }

      const progress = user.progress.find(
        (p) => p.roadmap.toString() === roadmapId
      );

      if (!progress) {
        throw new GraphQLError("User is not enrolled in this roadmap");
      }

      if (progress.completedSections.includes(sectionId)) {
        throw new GraphQLError("Section already completed");
      }

      progress.completedSections.push(sectionId);
      await user.save();

      const sections = await Promise.all(
        progress.completedSections
          .map((sectionId) =>
            Roadmap.findOne({ "sections._id": sectionId }, { "sections.$": 1 })
          )
          .map((res) => res?.sections[0])
      );

      return {
        ...user._doc,
        progress: [
          {
            roadmap: await Roadmap.findById(roadmapId),
            completedSections: sections.filter(Boolean),
          },
        ],
      };
    },
  },
  User: {
    id: (root) => root._id.toString(),
  },
  Roadmap: {
    id: (root) => root._id.toString(),
  },
  Progress: {
    roadmap: async (root) => {
      const roadmap = await Roadmap.findById(root.roadmap);
      return roadmap;
    },
    completedSections: async (root) => {
      return root.completedSections;
    },
  },
};

module.exports = resolvers;
