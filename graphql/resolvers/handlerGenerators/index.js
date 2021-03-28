/**
 * @file    
 */

// External Dependencies

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Internal Dependencies

import User from '../../../models/user';

/**
 * createUser() creates a new user in the database.
 * 
 * @param {Object} args: contains userInput object with email, password and
 * password confirmation
 * @returns a token and the user document.
 */

export async function createUser(args) {

    try {

        // Deconstruct arguments from userInput.

        const { email, password, confirmPassword } = args.userInput;

        // Check for user existence.

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists.');
        }

        // Confirm password fields are the same.

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match.');
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
        return { token, password: null, ...newUser._doc }

    } catch(error) {
      throw error;
    }
}

/**
 * authenticateUser() authenticates a user.
 * 
 * @param {Object} args: contains user email and password
 * @returns token and the user document.
 */

export async function authenticateUser(args) {
    
    try {

        // Check for user existence.

        const user = await User.findOne({ email: args.email });
        if (!user) {
            throw new Error('User with that email does not exist.');
        }

        // Validate password.

        const passwordIsValid = bcrypt.compareSync(args.password, user.password);
        if (!passwordIsValid) {
            throw new Error('Password incorrect');
        }

        // Create token using the user id as payloaad from the user document,
        // and return it with the user document.

        const token = jwt.sign({ id: user._id }, process.env.SECRET);
        return { token, password: null, ...user._doc }

    } catch (error) {
        throw error;
    }
}

/**
 * verifyToken() uses the decoded id verified from the token to lookup user.
 * 
 * @param {Object} args: contains token to be verified.
 * @returns user document.
 */

export async function verifyToken(args) {

    try {

        // Decode token, find user document containing decoded id and return
        // the user document.

        const decoded = jwt.verify(args.token, process.env.SECRET);
        const existingUser = await User.findOne({ _id: decoded.id })
        return { ...existingUser._doc, password: null };

    } catch (err) {
        throw err;
    }
}