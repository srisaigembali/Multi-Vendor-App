import express from "express";
import cloudinary from "cloudinary";
import User from "../models/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";
import sendToken from "../utils/sendJwtToken.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-user", async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return next(
        res.status(400).json({
          success: false,
          message: "User Already Exists!",
        })
      );
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

    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(
          res.status(400).json({
            success: false,
            message: "Invalid token",
          })
        );
      }
      const { name, email, password, avatar } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(
          res.status(400).json({
            success: false,
            message: "User Already Exists!",
          })
        );
      }
      user = await User.create({
        name,
        email,
        avatar,
        password,
      });

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(
          res.status(400).json({
            success: false,
            message: "Please provide all the fields!",
          })
        );
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(
          res.status(400).json({
            success: false,
            message: "User doesn't exists!",
          })
        );
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          res.status(400).json({
            success: false,
            message: "Please provide the correct information",
          })
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(
          res.status(400).json({
            success: false,
            message: "User doesn't exists",
          })
        );
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(
        res.status(400).json({
          success: false,
          message: error.message,
        })
      );
    }
  })
);

export default router;
