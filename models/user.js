/**
 * @file    MongoDB model
 * @author  Ric Mershon
 */

// External Dependencies

import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 32
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    organization: {
        type: String,
        required: false
    }
})

export default mongoose.model('User', userSchema);
