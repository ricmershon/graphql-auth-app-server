/**
 * @file    Resolvers for user collection
 * @author  Ric Mershon
 */

// External Dependencies

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Internal Dependencies

import User from '../../../models/user';

/**
 * createUser() creates a new user in the database.
 * 
 * @param {string} email
 * @param {string} password
 * @param {string} confirmPassword
 * @returns a token and the user document.
 */

export async function createUser({userInput: {
    email,
    password,
    confirmPassword
}}) {

    try {
        
        console.log("*** CREATING USER ***");
        console.log(`email: ${email}`);
        console.log(`password: ${password}`);
        console.log(`confirmPassword: ${confirmPassword}\n`);
        
        // Check for user existence and matching passwords.

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        // Hash paassword and create a new user document.

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User(
            { email, password: hashedPassword },
            (error) => {
                if (error) {
                    throw error
                }
            }
        );

        // Save user, create token using the user id as payloaad from the user
        // document and return it with the user document.

        newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET);
        return { token, ...newUser._doc }

    } catch(error) {
        console.error(error);
        throw error;
    }
}

/**
 * verifyToken() uses the decoded id verified from the token to lookup user.
 * 
 * @param {Object} params: contains token to be verified.
 * @returns user document.
 */

 export async function verifyToken({token}) {

    console.log("*** VERIFYING TOKEN ***\n", token, "\n");

    try {

        // Decode token, find user document containing decoded id and return
        // the user document.

        const decoded = jwt.verify(token, process.env.SECRET);
        const existingUser = await User.findOne({ _id: decoded.id })
        return { ...existingUser._doc, password: null };

    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * authenticateUser() authenticates a user.
 * 
 * @param {string} email
 * @param {string} password
 * @returns token and the user document.
 */

 export async function authenticateUser({email, password}) {
    
    try {

        console.log("*** AUTHENTICATING USER ***");
        console.log(`email: ${email}`);
        console.log(`password: ${password}`);
    
        // Check for user existence and validate password.

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User with that email does not exist');
        }

        const passwordIsValid = bcrypt.compareSync(
            password, user.password
        );
        if (!passwordIsValid) {
            throw new Error('Password incorrect');
        }

        // Create token using the user id as payloaad from the user document,
        // and return it with the user document.

        const token = jwt.sign({ id: user._id }, process.env.SECRET);
        return { token, password: null, ...user._doc }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * updateUser() updates database user information.
 * 
 * @param {ID} _id: _id for user document to be updated
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} organization
 * @param {number} badgeNumber
 * @returns an object containing updated user information.
 */

export async function updateUser({updateUserInput: {
    _id,
    firstName,
    lastName,
    organization,
    badgeNumber
}}) {

    try {
        
        console.log("*** UPDATING USER ***");
        console.log(`_id: ${_id}`);
        console.log(`firstName: ${firstName}`);
        console.log(`lastName: ${lastName}`);
        console.log(`organization: ${organization}`);
        console.log(`badgeNumber: ${badgeNumber}\n`);
 
        // Find the user document by its id, update with information
        // provided and return.
        
        const user = await User.findById(_id);
        if (!user) {
            throw new Error('User with that id does not exist');
        }
        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }
        if (organization) {
            user.organization = organization;
        }
        if (badgeNumber) {
            user.badgeNumber = badgeNumber;
        }

        const savedUser = await user.save()
        return { ...savedUser._doc }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * readUser() returns a document for a single user.
 * @param {ID} _id: _id of the user document to be retrieved. 
 * @returns user document.
 */

 export async function readUser({_id}) {
    try {
        console.log("*** DELETING USER ***");
        console.log(`_id: ${_id}\n`);

        // Check for user existence, delete user and return a record of the
        // deleted user record.

        const user = await User.findById(_id);
        if (!user) {
            throw new Error('User does not exist');
        }
        return { ...user._doc }

    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * deleteUser() deletes a user document.
 * 
 * @param {object} deleteUserInput: object containing id of user to be deleted 
 * @returns document id of user deleted
 */

export async function deleteUser({deleteUserInput}) {
    
    try {

        console.log("*** DELETING USER ***");
        console.log(`_id: ${deleteUserInput._id}\n`);
    
        // Check for user existence, delete user and return a record of the
        // deleted user record.

        const user = await User.findById(deleteUserInput._id);
        if (!user) {
            throw new Error('User does not exist');
        }
        const deletedUser = user.delete({ _id: deleteUserInput._id });
        return deletedUser;

    } catch (error) {
        console.log(error);
        throw error;
    }
}