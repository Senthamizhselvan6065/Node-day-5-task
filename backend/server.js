const express = require("express");
const server = express();

/* dot env */
const dotenv = require("dotenv");
dotenv.config();

/* cors */
const cors = require("cors");
server.use(cors());

/* Database */
const connectMongoDB = require(".//config/dbConfig");
connectMongoDB()

/* app server */
const app = require("./app");
server.use("/", app);

/* server start with localhost=70000 */
server.listen(process.env.PORT, ()=>{
     console.log(`Server Start with localhost:${process.env.PORT} and ${process.env.NODE_ENV}`);
})