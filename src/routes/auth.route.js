const { register } = require('../controllers/auth.controller');
const AuthRouter = require('express').Router();

AuthRouter.post("/register", register)
module.exports = AuthRouter;