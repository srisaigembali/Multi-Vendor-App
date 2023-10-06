import express from "express";
import cloudinary from "cloudinary";
import User from "../models/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const router = express.Router();

router.post("/create-user", async (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  const userEmail = await User.findOne({ email });

  if (userEmail) {
    return next(new ErrorHandler("User Already Exists", 400));
  }

  const myCloud = await cloudinary.v2.uploader.upload(avatar, {
    folder: "uploads",
  });

  const user = {
    name: name,
    email: email,
    password: password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  };

  const newUser = await User.create(user);
  res.status(201).json({
    success: true,
    newUser,
  });
});

export default router;
