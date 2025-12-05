require("dotenv").config();
exports.ENV_CONFIG = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    ERROR_LOG_URL: process.env.ERROR_LOG_URL,
}