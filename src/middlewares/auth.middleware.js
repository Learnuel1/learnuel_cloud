const {ENV_CONFIG} = require("../config/env");
const {default:APIError} = require("../utils/apiError");
const jwt = require ("jsonwebtoken")
exports.userRequired = async (req, res , next) => {
    try {

                 let accessToken = req.cookies?.leaRnCToken;
        if (!accessToken) accessToken = req.headers?.authurization?.split("")[1];
        if (!accessToken) accessToken = req.headers?.cookie?.split("=")[1];

        if(!accessToken) return next(APIError.unauthenticated())


const payload = jwt.verify(accessToken, ENV_CONFIG.ACCESS_TOKEN)






req.userId = payload.id
req.userEmail = payload.email
req.userPlan= payload.accountType
    } catch (error) {
        if(error.message = "jwt expires"){
            return next(APIError.unauthenticated("Token Expired"))
        }
        next(error)
    }
}