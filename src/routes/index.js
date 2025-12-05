const AuthRouter = require("./auth.route");

const AppRouter = require("express").Router();
AppRouter.use("/auth", AuthRouter);


module.exports = AppRouter;