import ProjectModel from "../models/project.model.js";
import mongoose from "mongoose";

export async function createProject({ name, userId }) {
  if (!name) {
    throw new Error("Project Name is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  let project;

  try {
    project = await ProjectModel.create({
      name,
      users: [userId]
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Project name already exists")
    }
    throw error;
  }
  return project;
}

export async function getAllProjectByUserId({ userId }) {
  if (!userId) {
    throw new Error("User ID is required")
  }

  const userAllProjects = await ProjectModel.find({
    users: userId
  });

  return userAllProjects;

}


export async function addUsersToProject({ projectId, users, userId }) {
  if (!projectId) {
    throw new Error("Project ID is required")
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId")
  }

  if (!users) {
    throw new Error("Users are required")
  }

  if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
    throw new Error("Invalid userId(s) in users array")
  }

  if (!userId) {
    throw new Error("userId is required")
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId")
  }

  const project = await ProjectModel.findOne({
    _id: projectId,
    users: userId
  });


  if (!project) {
    throw new Error("User does not belong to this project");
  }

  const updatedProject = await ProjectModel.findOneAndUpdate({
      _id: projectId
    }, {
      $addToSet: {
        users: {
          $each: users
        }
      }
    }, {
      new: true
    })

  return updatedProject;
}


export async function getProjectById({projectId}) {
  if (!projectId) {
    throw new Error("Project ID is required")
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId")
  }

  const project = await ProjectModel.findOne({
    _id: projectId,
  }).populate('users');
  
  if (!project) {
    throw new Error("User does not belong to this project");
  }

  return project
}