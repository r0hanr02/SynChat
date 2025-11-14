import userModel from "../models/userModel.js";
import * as userServices from "../services/userServices.js";
import { validationResult } from "express-validator";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userServices.createUser(req.body);
    const token = await user.generateToken();
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
