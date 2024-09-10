import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const CREATE_USER = gql`
  mutation ($username: String!, $password: String!) {
    createUser(username: $username, password: $password, isAdmin: false) {
      username
    }
  }
`;

export const ALL_ROADMAPS = gql`
  query AllRoadmaps($includeDrafts: Boolean) {
    allRoadmaps(includeDrafts: $includeDrafts) {
      id
      title
      description
      image
      sections {
        id
        title
        description
        images
        modules {
          title
          content
        }
      }
    }
  }
`;

export const ENROLL_USER = gql`
  mutation ($roadmapId: ID!) {
    enrollUser(roadmapId: $roadmapId) {
      progress {
        roadmap {
          title
        }
        completedSections {
          title
        }
      }
    }
  }
`;

export const ALL_USERS = gql`
  query {
    allUsers {
      username
      points
      progress {
        roadmap {
          title
        }
      }
    }
  }
`;

export const ALL_UPCOMING_ROADMAPS = gql`
  query {
    allUpcomingRoadmaps {
      title
      description
      image
      id
    }
  }
`;

export const CREATE_ROADMAP = gql`
  mutation CreateRoadmap(
    $title: String!
    $description: String!
    $image: String!
    $sections: [SectionInput!]!
    $draft: Boolean
  ) {
    createRoadmap(
      title: $title
      description: $description
      image: $image
      sections: $sections
      draft: $draft
    ) {
      id
      title
      description
      image
    }
  }
`;

export const CREATE_UPCOMING_ROADMAP = gql`
  mutation CreateRoadmap(
    $title: String!
    $description: String!
    $image: String!
  ) {
    createUpcomingRoadmap(
      title: $title
      description: $description
      image: $image
    ) {
      id
      title
      description
      image
    }
  }
`;

export const ME = gql`
  query {
    me {
      username
      isAdmin
      progress {
        completedSections {
          title
          id
        }
        roadmap {
          id
          title
          description
          image
          sections {
            learningObjectives
            id
            title
            description
            images
            modules {
              title
              content
            }
          }
        }
      }
      points
    }
  }
`;

export const COMPLETE_SECTION = gql`
  mutation ($roadmapId: ID!, $sectionId: ID!) {
    completeSection(roadmapId: $roadmapId, sectionId: $sectionId) {
      progress {
        roadmap {
          title
        }
        completedSections {
          title
        }
      }
    }
  }
`;

export const PUBLISH_ROADMAP = gql`
  mutation ($roadmapId: ID!) {
    updateRoadmap(roadmapId: $roadmapId) {
      title
    }
  }
`;

export const GET_POLLS = gql`
  query GetAllPolls {
    getAllPolls {
      id
      votes {
        optionId
        count
      }
    }
  }
`;

export const CAST_VOTE = gql`
  mutation CastVote($pollId: ID!, $optionId: ID!) {
    castVote(pollId: $pollId, optionId: $optionId) {
      id
      votes {
        optionId
        count
      }
    }
  }
`;
