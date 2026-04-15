import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from "./db/connect.js";
import fs from "fs";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); //middleware 
// middleware are functions that have the acces of request and response, they can also modify the request and response cycle
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use((req,res,next)=>{
//   next()
// })

// routes
const routeFiles = fs.readdirSync("./routes");

routeFiles.forEach((file) => {
  // import dynamic routes
  import(`./routes/${file}`)
    .then((route) => {
      app.use("/api/v1/", route.default);
    })
    .catch((error) => {
      console.log("Error importing route", error);
    });
});

const server = async () => {
  try {
    await connect();

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Server error", error.message);
    process.exit(1);
  }
};

server();
