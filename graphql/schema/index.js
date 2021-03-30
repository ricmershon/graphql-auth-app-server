/**
 * @file    GraphQL schema
 * @author  Ric Mershon
 */

import { buildSchema } from 'graphql';

export default buildSchema(`
    type User {
        _id: ID!
        email: String!
        token: String!
        firstName: String
        lastName: String
        organization: String
        badgeNumber: Int
    }
    input UserInput {
        email: String!
        password: String!
        confirmPassword: String!
    }
    input UpdateUserInput {
        _id: ID!
        firstName: String
        lastName: String
        organization: String
        badgeNumber: Int
    }
    input DeleteUser {
        _id:ID!
    }
    type RootQuery {
        authenticateUser(email: String!, password: String!): User
        readUser(_id: ID!): User
        verifyToken(token: String!): User
    }
    type RootMutation {
        createUser(userInput: UserInput): User
        updateUser(updateUserInput: UpdateUserInput): User
        deleteUser(deleteUserInput: DeleteUser): User
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)