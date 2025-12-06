import {Schema, model } from "mongoose";

const accountSchema = new Schema( {
    firstName: {
        type: String,
        required: true,
        minLength: 4,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 4,
    },
    email: { type: String, 
        unique: true,
        required: true,
        index: true 
    },
    phone: { type: String, 
        unique: true 
    },
    accountType: {
        type: String,
        enum: ["Free", "Starter", "Premium"],
        default: "Free"
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    refreshToken: {
        type: [String],
        default: []
    },
}, {timestamps: true});

const AccountModel =  model("Account", accountSchema);
export default  AccountModel;
