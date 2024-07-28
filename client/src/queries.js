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
        resources
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
  mutation (
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
      title
      image
    }
  }
`;
