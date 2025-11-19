import mongoose from "mongoose";
import projectModel from "../models/projectModel.js";

export const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Name is required");
  }
  if (!userId) {
    throw new Error("User is required");
  }
  let project;
  try {
    project = await projectModel.create({
      name,
      users: [userId],
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Project name already exists");
    }
    throw error;
  }
  return project;
};

export const getAllProjectByUserId = async ({ userId }) => {
  if (!userId) {
    throw new Error("UserId is Required");
  }
  const allUserProject = await projectModel.find({
    users: userId,
  });
  return allUserProject;
};

export const addUsersToProject = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error("projectId is required");
  }
  if (!userId) {
    throw new Error("userId is required");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("projectId must be a valid MongoDB ObjectId");
  }
  if (!users) {
    throw new Error("Users are required");
  }
  if (!Array.isArray(users)) {
    throw new Error("Users must be an array");
  }
  for (const userId of users) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error(`User ID '${userId}' is not a valid MongoDB ObjectId`);
    }
  }

  const project = await projectModel.findOne({
    _id: projectId,
    users: userId,
  });

  if (!project) throw new Error("User not Belong to this Project");
  const updatedProject = await projectModel.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      $addToSet: {
        users: {
          $each: users,
        },
      },
    },
    {
      new: true,
    }
  );
  return updatedProject;
};

export const getProjectById = async ({ projectId }) => {
  if (!projectId) {
    throw new Error("ProjectId is Required");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid ProjectId");
  }

  const project = await projectModel
    .findOne({
      _id: projectId,
    })
    .populate("users");
  return project;
};
