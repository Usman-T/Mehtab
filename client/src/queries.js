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
