import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js"
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";


export const createUserController = async function(req, res) {
  
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

  try {
    const user = await userService.createUser(req.body);

    delete user._doc.password;

    const token = await user.generateJWT();

    res.status(201).json({user, token});
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const loginController = async function(req, res) {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select('+password');

    if(!user) {
      res.status(401).json({error: "User does not exists"})
    }

    const isMatch = await user.isValidPassword(password);
    if(!isMatch) {
      res.status(401).json({error: "Password does not match"})
    }

    delete user._doc.password;

    const token = await user.generateJWT();
    res.status(201).json({user, token});
  } catch (error) {
    res.status(400).send(error.message);
  }
}


export const profileController = async function(req, res) {
  res.status(200).json({
    user: req.user
  })
}

export const logoutController = async function(req, res) {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    redisClient.set(token, 'logout', 'EX', 60*60*24);

    res.status(200).json({
      message: "User loged out"
    })

  } catch (error) {
    console.log(error)
  }
}

export const getAllUsersController = async function(req, res) {
  try {
    const loggedInUser = await userModel.findOne({
      email: req.user.email
    })

    const userId = loggedInUser._id;
    const allUsers = await userService.getAllUsers({userId});

    res.status(200).json({
      users: allUsers
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({error: error.message});
  }
}