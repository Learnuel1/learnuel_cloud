const { connect } = require("mongoose");
const { ENV_CONFIG } = require("./env");

const connectDB = async () => {
  try {
    await connect(ENV_CONFIG.DB_URL);
    console.log(" Database Connected successfully");
  } catch (error) {
    console.error("Database Connection Error:", error);
    process.exit(1); 
  }
};

module.exports = connectDB;