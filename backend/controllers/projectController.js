import projectModel from "../models/projectModel.js";
import userModel from "../models/userModel.js";
import {
  addUsersToProject,
  createProject,
  getAllProjectByUserId,
  getProjectById,
} from "../services/projectService.js";

import { validationResult } from "express-validator";

export const createProjectController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name } = req.body;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const userId = loggedInUser._id;
    const newProject = await createProject({ name, userId });
    res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export const getAllProjectController = async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne({
      email: req.user.email,
    });

    const allUserProjects = await getAllProjectByUserId({
      userId: loggedInUser._id,
    });
    return res.status(200).json({
      projects: allUserProjects,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const addUserToProjectController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { projectId, users } = req.body;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const project = await addUsersToProject({
      projectId,
      users,
      userId: loggedInUser._id,
    });
    return res.status(200).json({
      project,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

export const getProjectByIdController = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await getProjectById({ projectId });
    return res.status(200).json({ project: project });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};
