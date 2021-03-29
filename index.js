/**
 * @file    Example GraphQL app
 * @author  Ric Mershon
 */

// External Dependencies

import express from 'express';
import bodyParser from 'body-parser';
import {graphqlHTTP} from 'express-graphql';
import cors from 'cors';
import mongoose from 'mongoose';

// Internal Dependencies

import graphQLSchema from './graphql/schema';
import graphQLResolvers from './graphql/resolvers';

// Configuration

require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const mongodbURI =
    "mongodb+srv://" + process.env.DB_USER + ":" +
    process.env.DB_PASS + "@cluster0.dtbwe.mongodb.net/" +
    process.env.DB_NAME + "?retryWrites=true&w=majority"

// Middleware

app.use(cors(), bodyParser.json())
app.use(
    "/graphql",
    graphqlHTTP({
        schema: graphQLSchema,
        rootValue: graphQLResolvers,
        graphiql: true
    })
);

// Database

mongoose.connect(
    mongodbURI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(`MongoDB '${process.env.DB_NAME}' is connected`))

// Server listener

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))