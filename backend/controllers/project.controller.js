import ProjectModel from "../models/project.model.js";
import * as projectService from "../services/project.service.js"
import { validationResult } from "express-validator";
import User from "../models/user.model.js";

export async function createProject(req, res) {
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

  try {
    const { name } = req.body;

    const loggedInUser = await User.findOne({ email: req.user.email });
    const userId = loggedInUser._id;
    const newProject = await projectService.createProject({name, userId})

    res.status(200).json(newProject);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }

}

export async function getAllProjects(req, res) {
  
  try {
    const loggedInUser = await User.findOne({
      email: req.user.email
    });

    const userId = loggedInUser._id;

    const userAllProjects = await projectService.getAllProjectByUserId({userId});

    res.status(200).json({
      projects: userAllProjects
    })
    
  } catch (error) {
    console.log(error.message)
    res.status(400).json({error: error.message})
  }

}

export async function addUserToProject(req, res) {
  
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

  try {
    
    const {projectId, users} = req.body;

    const loggedInUser = await User.findOne({
      email: req.user.email
    })

    const userId = loggedInUser._id;

    const project = await projectService.addUsersToProject({
      projectId,
      users,
      userId
    })

    res.status(200).json({
      project
    })

  } catch (error) {
    console.log(error.message)
    res.status(400).json({error: error.message})
  }

}

export async function getProjectById(req, res) {
  try {
    const { projectId } = req.params;

    const project = await projectService.getProjectById({projectId});

    res.status(200).json({
      project
    })
  } catch (error) {
    console.log(error.message)
    res.status(400).json({error: error.message})
  }
}