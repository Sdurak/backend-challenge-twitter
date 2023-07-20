//1. importlar
const express = require("express");
const server = express();
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const { restricted } = require("./Auth/auth-middleware");
const authRouter = require("../api/Auth/auth-router.js");
const userRouter = require("../api/Users/users-router");
const tweetRouter = require("../api/Tweets/tweets-router");

//2. global middleware

server.use(cors());
server.use(morgan("dev"));
server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/users", userRouter);
server.use("/api/tweets", tweetRouter);

//3. routerlar
server.get("/", restricted, (req, res) => {
  res.json({ message: "Server up and running..." });
});

//4. Error middleware
server.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error!.." });
});

//5. exports
module.exports = server;
