const typeDefs = `
type User {
  username: String!
  isAdmin: Boolean!
  points: Int!
  progress: [Progress]!
  id: ID!
}

type Progress {
  roadmap: Roadmap
  completedSections: [Section]
}

type Section {
  title: String!
  content: String!
  resources: [String]!
  id: ID!
}

type Roadmap {
  title: String!
  description: String!
  image: String!
  sections: [Section]!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  me: User
  allUsers: [User]
  allRoadmaps: [Roadmap]
}

type Mutation {
  createUser(
    username: String!
    password: String!
    isAdmin: Boolean!
  ): User
  login(
    username: String!
    password: String!
  ): Token
  createRoadmap(
    title: String!
    description: String!
    image: String!
    sections: [SectionInput!]!
  ): Roadmap
  enrollUser(roadmapId: ID!): User
  completeSection(
    roadmapId: ID!
    sectionId: ID!
  ): User
}

input SectionInput {
  title: String!
  content: String!
  resources: [String]!
}
`;

module.exports = typeDefs;
