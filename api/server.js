//1.import
const express = require("express");
const server = express();
require("dotenv").config();
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

//2.global mw'ler
server.use(helmet()); //3rd-party middleware
server.use(cors());
server.use(morgan("dev"));
server.use(express.json()); //build-in middleware

//3.routerler
server.get("/", (req, res) => {
  res.json({ message: "Server up and running..." });
});

//4.error mw'ler
server.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error!.." });
});

//5.exports
module.exports = server;
