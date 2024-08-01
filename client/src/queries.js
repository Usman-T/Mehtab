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
  query {
    allRoadmaps {
      title
      description
      image
      id
      sections {
        title
        content
        images
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

export const CREATE_ROADMAP = gql`
  mutation CreateRoadmap(
    $title: String!
    $description: String!
    $image: String!
    $sections: [SectionInput!]!
  ) {
    createRoadmap(
      title: $title
      description: $description
      image: $image
      sections: $sections
    ) {
      id
      title
      description
      image
      sections {
        title
        content
        description
        images
      }
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
          description
          image
          title
          sections {
            title
            description
            content
            images
            id
          }
        }
      }
      points
    }
  }
`;
