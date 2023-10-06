import app from "./app.js";
import dotenv from "dotenv";
import connectDatabase from "./db/Database.js";
import cloudinary from "cloudinary";

// handling uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting the server down for handling uncaught exception`);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "backend/config/.env",
  });
}

// connect to database
connectDatabase();

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// create server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting the server down for unhandled promise rejection`);

  server.close(() => process.exit(1));
});
