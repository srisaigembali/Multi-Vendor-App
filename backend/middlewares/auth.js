import jwt from "jsonwebtoken";
import User from "../models/user.js";
import catchAsyncErrors from "./catchAsyncErrors.js";

const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      res.status(401).json({
        success: false,
        message: "Please login to continue",
      })
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
});

export { isAuthenticated };
