const { CONSTANTS } = require("../config");
const { ENV_CONFIG } = require("../config/env");
const { findByEmail, save, saveRefreshToken, findByRefreshToken, findByAccountId } = require("../services/account.service");
const { default: APIError } = require("../utils/apiError");
const { isEmailValid, isPasswordStrongManual } = require("../utils/validator");
const { hashSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken")

exports.register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;
        if (!email) return next(APIError.badRequest("Email is required"));
        if (!isEmailValid(email)) return next(APIError.badRequest("Invalid email format"));
        if (!password) return next(APIError.badRequest("Password is required"));
        if (!isPasswordStrongManual(password)) return next(APIError.badRequest("a is not strong enough"));
        if (!firstName) return next(APIError.badRequest("First name is required"));
        if (!isNaN(firstName)) return next(APIError.badRequest("First name cannot be a number"));
        if (!lastName) return next(APIError.badRequest("Last name is required"));
        if (!phone) return next(APIError.badRequest("Phone number is required"));
        const emailExists = await findByEmail(email);
        if (emailExists?.error) return next(APIError.badRequest(emailExists.error));
        if (emailExists) return next(APIError.badRequest("Email already registered"));
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
        if (savedUser?.error) return next(APIError.badRequest(savedUser.error));
        if (!savedUser) return next(APIError.internal("Unable to register user at the moment"));
        console.log("Registered User successfully");
        res.status(200).json({ message: "Registration completed successfully" });
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        console.log(req.cookies);
        console.log(req.headers);
        let accessToken = req.cookies?.leaRnCToken;
        if (!accessToken) accessToken = req.headers?.authurization?.split("")[1];
        if (!accessToken) accessToken = req.headers?.cookie?.split("")[1];


        if (accessToken) {
            //verify token
            return res.status(200).json({ message: "User already logged in" })
        }
        const { email, password } = req.body;
        if (!email) return next(APIError.badRequest("Email is required"))
        if (!password) return next(APIError.badRequest("Password is required"))

        const userExists = await findByEmail(email);
        if (userExists?.error) return next(APIError.badRequest(userExists.error));
        if (!userExists) return next(APIError.badRequest("Account not found"))
        if (!compareSync(password, userExists.password)) return next(APIError.badRequest("Incorrect Passwword"));
        const payload = {
            id: userExists._id,
            email: userExists.email,
            accountType: userExists.accountType
        };
        const Token = jwt.sign(payload, ENV_CONFIG.ACCESS_TOKEN, { expiresIn: '5m' })
        const refreshToken = jwt.sign(payload, ENV_CONFIG.ACCESS_TOKEN, { expiresIn: '15m' })
        userExists.refreshToken.push(refreshToken)
        const saveRefresh = await saveRefreshToken(userExists._id, userExists.refreshToken)
        if (saveRefresh?.error) return next(APIError.badRequest("Error saving Refresh Token"))
        console.log(saveRefresh);

        if (!saveRefresh) return next(APIError.badRequest("Unable to login at the moment"))
        res.cookie("leaRnCToken", Token, {
            httpOnly: true,
            maxAge: 5 * 60 * 1000
        })
        res.status(200).json({ message: "Login successful", Token, refreshToken })
    } catch (error) {
        next(error)
    }
}

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return next(APIError.badRequest("Refresh token is required"))
        let accessToken = req.cookies?.leaRnCToken;
        if (!accessToken) accessToken = req.headers?.authurization?.split("")[1];
        if (!accessToken) accessToken = req.headers?.cookie?.split("")[1];

        res.clearCookie("leaRnCToken", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        })
        const foundUser = await findByRefreshToken(refreshToken);
        
        if (!foundUser) {
            const check = jwt.decode(refreshToken, ENV_CONFIG.REFRESH_TOKEN);
            if (!check) return next(APIError.unauthenticated("Invalid refresh token"))
            const usedToken = await findByAccountId(check._id);
            if (usedToken) {
                // console.log(usedToken);
                
                usedToken.refreshToken = [];
                const update = await saveRefreshToken(usedToken._id,usedToken.refreshToken);
                if (update?.error) return next(APIError.badRequest(update.error));

                if (!update) return next(APIErrorr.badRequest("Error updating refresh token"))

                return next(APIError.unauthenticated("Refresh Token has been used. Please login again"))
            }
        }
        const newRefreshTokenArr = foundUser.refreshToken.filter((token) => token !== refreshToken)


        jwt.verify(refreshToken, ENV_CONFIG.REFRESH_TOKEN, async (err, decoded) => {
            if (err) {

                // foundUser.refreshToken = [...newRefreshTokenArr]
                // foundUser.save()

                const update = await saveRefreshToken(foundUser._id,
                    newRefreshTokenArr)
                if (update?.error) return next(APIError.badRequest(update.error));
                if (!update) return next(APIErrorr.badRequest("Error updating refresh token"))
                }

            if (err || foundUser._id.toString() !== decoded.id) {
                return next(APIErrorr.unauthorized("Refresh token reused or invalid"))
        }
 const payload = {
            id: foundUser._id,
            email: foundUser.email,
            accountType: foundUser.accountType
        };
const Token = jwt.sign(payload, ENV_CONFIG.REFRESH_TOKEN, { expiresIn: '5m' })
        const newRefreshToken = jwt.sign(payload, ENV_CONFIG.REFRESH_TOKEN, { expiresIn: '15m' })

const updatedRefreshTokenArr = [...newRefreshTokenArr, newRefreshToken]
const saveRefresh = await saveRefreshToken(foundUser._id, updatedRefreshTokenArr)

        if (saveRefresh?.error) return next(APIError.badRequest("Error saving Refresh Token"))
        console.log(saveRefresh);

        if (!saveRefresh) return next(APIError.badRequest("Unable to login at the moment"))
        res.cookie("leaRnCToken", Token, {
            httpOnly: true,
            maxAge: 5 * 60 * 1000
        })
        res.status(200).json({ message: "Login successful", Token, refreshToken: newRefreshToken})

        })
} catch (error) {
    next(error)
}
}