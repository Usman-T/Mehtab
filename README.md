# Mehtab

Mehtab is a comprehensive web application designed to help users learn new skills through interactive roadmaps. Users can register, enroll in roadmaps, and complete them in their respective section pages. The project features both a frontend built with React and a backend powered by GraphQL, which is deployed as a Lambda function on Netlify.

## Features

- **User Registration & Authentication:** Users can create accounts, log in, and manage their profiles.
- **Roadmap Enrollment:** Users can browse available roadmaps, enroll in them, and track their progress.
- **Interactive Sections:** Each roadmap is divided into sections, which users can complete one by one.
- **Admin Management:** Admin users can create, update, and delete roadmaps directly from the frontend interface.

## Frontend

- **React:** The frontend is built with React, providing a dynamic and responsive user interface.
- **Apollo Client:** Apollo Client is used to interact with the GraphQL backend, handling data fetching and caching.
- **ShadCN:** The UI components are styled using ShadCN, ensuring a modern and cohesive design throughout the application.
- **Admin Functionality:** Admin users have access to specialized tools that allow them to manage roadmaps, including creating new roadmaps, updating existing ones, and deleting those that are no longer needed.

## Backend

The backend of Mehtab is implemented using GraphQL and is deployed as a Lambda function on Netlify. It includes the following queries and mutations:

### Queries

- **`me: User`**: Fetches the currently authenticated user's data.
- **`allUsers: [User]`**: Retrieves a list of all registered users.
- **`allRoadmaps: [Roadmap]`**: Retrieves a list of all available roadmaps.

### Mutations

- **`createUser(username: String!, password: String!, isAdmin: Boolean!): User`**: Creates a new user. The `isAdmin` flag determines if the user has admin privileges.
- **`login(username: String!, password: String!): Token`**: Authenticates a user and returns a token for session management.
- **`createRoadmap(title: String!, description: String!, image: String!, sections: [SectionInput!]!): Roadmap`**: Allows an admin user to create a new roadmap.
- **`enrollUser(roadmapId: ID!): User`**: Enrolls the current user in a specified roadmap.
- **`completeSection(roadmapId: ID!, sectionId: ID!): User`**: Marks a section of a roadmap as completed for the current user.

## Installation

To set up the project locally, follow these steps:

### Prerequisites

- Node.js (version 14.x or higher)
- npm or yarn
- A Netlify account (for deploying the backend)

### Backend Setup

1. Clone the repository and navigate to the backend folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Deploy the backend to Netlify using the Netlify CLI:
   ```bash
   netlify deploy --prod
   ```
4. Configure the environment variables in Netlify to include your database connection string and any other necessary configurations.

### Frontend Setup

1. Navigate to the `client` folder in the project.
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Access the application in your browser at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to write tests for any new features or bug fixes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
