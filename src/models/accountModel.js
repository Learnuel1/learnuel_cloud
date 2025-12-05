const mongoose = require("mongoose");

const accountSchema = {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    accountType: {
        type: String,
        enum: ["Free", "Starter", "Premium"],
    }
};

module.exports = mongoose.model("Account", accountSchema);
