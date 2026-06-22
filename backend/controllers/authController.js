import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";

//generate jwt token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

//@desc    Register a new user
//@route   POST /api/auth/register
//@access  Public
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg,
      });
    }

    const { username, email, password } = req.body;

    const userExists = await User.findOne({
      $or: [{ email }, { name: username }],
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error:
          userExists.email === email
            ? "Email already registered"
            : "Username already taken",
      });
    }

    const user = await User.create({
      name: username,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.name,
          email: user.email,
          profileImage: user.profileImage || "",
          createdAt: user.createdAt,
        },
        token,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

//@desc    Login user
//@route   POST /api/auth/login
//@access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
        statusCode: 400,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
        statusCode: 401,
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
        statusCode: 401,
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.name, // ✅ fixed
          email: user.email,
          profileImage: user.profileImage || "",
        },
        token,
      },
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

//@desc    Get user profile
//@route   GET /api/auth/profile
//@access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.name, // ✅ fixed
        email: user.email,
        profileImage: user.profileImage || "",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: "User profile fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

//@desc    Update user profile
//@route   PUT /api/auth/profile
//@access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { username, email, profileImage } = req.body;

    const user = await User.findById(req.user._id);

    if (username) user.name = username;
    if (email) user.email = email;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.name, // ✅ fixed
        email: user.email,
        profileImage: user.profileImage || "",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: "User profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

//@desc    Change user password
//@route   PUT /api/auth/change-password
//@access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Please provide current and new password",
        statusCode: 400,
      });
    }

    const user = await User.findById(req.user._id); // ✅ removed .select("+password")

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
        statusCode: 401,
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

//@desc    Forgot password
//@route   POST /api/auth/forgot-password
//@access  Public
export const forgotPassword = async (req, res) => {
  res.json({
    success: true,
    message: "Forgot password route working",
  });
};

//@desc    Reset password
//@route   POST /api/auth/reset-password/:token
//@access  Public
export const resetPassword = async (req, res) => {
  res.json({
    success: true,
    message: "Reset password route working",
  });
};
