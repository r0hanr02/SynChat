import userModel from "../models/userModel.js";
import * as userServices from "../services/userServices.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redisService.js";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userServices.createUser(req.body);
    const token = await user.generateToken();
    delete user._doc.password;
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
export const loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        errors: "Invalid Credentials",
      });
    }
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        errors: "Invalid Credentials",
      });
    }

    const token = await user.generateToken();
    delete user._doc.password;
    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export const profileController = async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

export const logOutController = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    redisClient.set(token, "logout", "EX", 60 * 60 * 24);

    res.status(200).json({
      message: "Logged Out Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne({
      email: req.user.email,
    });
    const allUsers = await userServices.getAllUsers({
      userId: loggedInUser._id,
    });
    return res.status(200).json({
      users: allUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
