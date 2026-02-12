import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    gender: {
        type: String,
        enum: [
            "male",
            "female",
            "other"
        ],
        required: true
    },
    status: {
        type: String,
        enum: [
            "active",
            "inactive"
        ],
        default: "active"
    },
    location: {
        type: String,
        required: true
    }
    
}, {timestamps: true})

export const User = mongoose.model("User", userSchema);
