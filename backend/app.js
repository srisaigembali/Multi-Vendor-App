import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import ErrorHandler from "./utils/ErrorHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "backend/config/.env",
  });
}

// for error handling
app.use(ErrorHandler);

export default app;
