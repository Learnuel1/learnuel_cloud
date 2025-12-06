const { CONSTANTS } = require("../config");
const { findByEmail, save } = require("../services/account.service");
const { default: APIError } = require("../utils/apiError");
const { isEmailValid, isPasswordStrongManual } = require("../utils/validator");
const { hashSync } = require("bcrypt");

exports.register =  async (req, res, next) => {
    try{
    const { email, password, firstName, lastName, phone} = req.body;
    if(!email) return next(APIError.badRequest("Email is required"));
    if(!isEmailValid(email)) return next(APIError.badRequest("Invalid email format"));
    if(!password) return next(APIError.badRequest("Password is required"));
    if(!isPasswordStrongManual(password)) return next(APIError.badRequest("Password is not strong enough"));
    if(!firstName) return next(APIError.badRequest("First name is required"));
    if(!isNaN(firstName)) return next(APIError.badRequest("First name cannot be a number"));
    if(!lastName) return next(APIError.badRequest("Last name is required"));
    if(!phone) return next(APIError.badRequest("Phone number is required"));
    const emailExists = await  findByEmail(email);
    if(emailExists?.error) return next(APIError.badRequest(emailExists.error));
    if(emailExists) return next(APIError.badRequest("Email already registered"));
    const user = {
        email, 
        password, 
        firstName, 
        lastName, 
        phone,
        password: hashSync(password, 10),
        accountType: CONSTANTS.ACCOUNT_TYPE.free
    };
    // register and save user to database
    const savedUser = await save(user);
    if(savedUser?.error) return next(APIError.badRequest(savedUser.error));
    if(!savedUser) return next(APIError.internal("Unable to register user at the moment"));
    console.log("Registered User successfully");
    res.status(200).json({ message: "Registration completed successfully" });
}catch (error) {
    next(error);
}
}