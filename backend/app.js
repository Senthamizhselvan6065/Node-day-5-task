const express = require("express");
const app = express();

/* body parser */
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/* user router */
const userRouter = require("./controllers/user.controller");
/* urlPath and router */
app.use("/api/user", userRouter);

/* Error Middleware */
const ErrorMiddleware = require("./middlewares/ErrorMiddleware");
app.use(ErrorMiddleware);

module.exports = app;