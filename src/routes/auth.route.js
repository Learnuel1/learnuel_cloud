const { register, refreshToken } = require('../controllers/auth.controller');
const { login } = require('../controllers/auth.controller');

const AuthRouter = require('express').Router();

AuthRouter.post("/register", register).post("/login", login).post("/refresh-token",refreshToken)
module.exports = AuthRouter;