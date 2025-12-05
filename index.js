const express = require("express");
const { CONFIG } = require("./src/config");
const { ENV_CONFIG } = require("./src/config/env");
const server = express();
const AppRouter = require("./src/routes");

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.get("/api/v1/status", (_req, res) => {
    res.status(200).json({ message: `${CONFIG.APP_NAME} is live` });
});
server.use("/api/v1", AppRouter);

server.listen(ENV_CONFIG.PORT, async () => {
    try {
        console.log(`${CONFIG.APP_NAME} is running on port http://localhost:${ENV_CONFIG.PORT}`);
    } catch (error) {
        console.log(error);
        process.exit(-1)
        
    }
})