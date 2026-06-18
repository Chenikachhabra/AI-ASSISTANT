import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

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
    const { username, email, password } = req.body;
  } catch (error) {
    next(error);
  }
};

//@ts-check
//@route   POST /api/auth/login
//@access  Public
export const login = (req, res, next) => {
  const { email, password } = req.body;
};

//@desc    Get user profile
//@route   GET /api/auth/profile
//@access  Private
export const getProfile = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");
};

//@desc    Update user profile
//@route   PUT /api/auth/profile
//@access  Private
export const updateProfile = async (req, res, next) => {
  const { username, email } = req.body;
};

//@desc    Change user password
//@route   PUT /api/auth/change-password
//@access  Private
export const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
};
