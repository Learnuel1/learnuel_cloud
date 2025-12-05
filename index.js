const express = require("express");
const server = express();
const {CONFIG} = require("./src/config")
const AppRouter = require("./src/routes");
const connectDB = require("./src/config/db");
const { ENV_CONFIG } = require("./src/config/env");

const errorMiddleware = require("./src/middlewares/error.middleware");


server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.get("/api/v1/status", (_req, res) => {
    res.status(200).json({ message: `${CONFIG.APP_NAME} is live` });
});
server.use("/api/v1", AppRouter); 
server.use(errorMiddleware.errorHandler);
server.listen(ENV_CONFIG.PORT, async () => {
    try {
        console.log("connecting to database...");
        
        await connectDB();
        console.log(`${CONFIG.APP_NAME} is running on port http://localhost:${ENV_CONFIG.PORT}`);
    } catch (error) {
        console.log(error);
        process.exit(-1)
        
    }
})