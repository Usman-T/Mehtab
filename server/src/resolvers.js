const { GraphQLError } = require("graphql");
const User = require("./models/user");
const Roadmap = require("./models/roadmap");
const Section = require("./models/section");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const resolvers = {
  Query: {
    me: (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Authentication required");
      }
      return context.currentUser;
    },

    allUsers: async () => {
      return User.find({}).populate({
        path: "progress.roadmap",
        populate: {
          path: "sections",
        },
      });
    },
    allRoadmaps: async () => {
      return Roadmap.find({}).populate("sections");
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const { username, password, isAdmin } = args;

      if (!username || !password) {
        throw new GraphQLError("Username and password are required");
      }

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new GraphQLError("Username already exists");
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = new User({
        username,
        passwordHash,
        isAdmin: isAdmin || false,
        progress: [],
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

      if (!user) {
        throw new GraphQLError("User not found");
      }

      const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

      if (!passwordCorrect) {
        throw new GraphQLError("Invalid password");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
        isAdmin: user.isAdmin,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    createRoadmap: async (root, args, context) => {
      const { title, description, image, sections } = args;
      const currentUser = context.currentUser;

      if (!currentUser || !currentUser.isAdmin) {
        throw new GraphQLError("Only admins can create roadmaps");
      }

      if (!title || !description || !image || !sections || sections.length === 0) {
        throw new GraphQLError("All fields are required and sections cannot be empty");
      }

      const sectionsToCreate = await Section.insertMany(sections);

      const roadmapToSave = new Roadmap({
        title,
        description,
        image,
        sections: sectionsToCreate.map(section => section._id),
      });

      return roadmapToSave.save();
    },
    enrollUser: async (root, args, context) => {
      const { roadmapId } = args;
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("Authentication required");
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
        (enrolledRoadmap) => enrolledRoadmap.roadmap.toString() === roadmapId
      );

      if (isEnrolled) {
        throw new GraphQLError("User already enrolled in this roadmap");
      }

      user.progress.push({
        roadmap: roadmap._id,
        completedSections: [],
      });
      return user.save();
    },
    completeSection: async (root, args, context) => {
      const { roadmapId, sectionId } = args;
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("Authentication required");
      }

      const user = await User.findById(currentUser.id);
      if (!user) {
        throw new GraphQLError("User not found");
      }

      const enrolledRoadmap = user.progress.find(
        (er) => er.roadmap.toString() === roadmapId
      );

      if (!enrolledRoadmap) {
        throw new GraphQLError("User is not enrolled in this roadmap");
      }

      const roadmap = await Roadmap.findById(roadmapId);
      if (!roadmap) {
        throw new GraphQLError("Roadmap not found");
      }

      const sectionExists = roadmap.sections.includes(sectionId);
      if (!sectionExists) {
        throw new GraphQLError("Section not found in the roadmap");
      }

      if (enrolledRoadmap.completedSections.includes(sectionId)) {
        throw new GraphQLError("Section already completed");
      }

      enrolledRoadmap.completedSections.push(sectionId);
      user.points = user.points + 10

      return user.save();
    },
  },
  User: {
    id: (root) => root._id.toString(),
    progress: async (root) => {
      const populatedUser = await User.findById(root._id).populate({
        path: "progress.roadmap",
        populate: {
          path: "sections",
        },
      }).populate('progress.completedSections')
      return populatedUser.progress;
    },
  },
  Roadmap: {
    id: (root) => root._id.toString(),
  },
};

module.exports = resolvers;
