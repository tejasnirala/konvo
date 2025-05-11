import { Router } from "express";
import * as userController from "../controllers/user.controller.js"
import { body } from "express-validator";
import * as authMiddleware from "../middlewares/auth.middleware.js"

const userRoutes = Router();

userRoutes.post('/register',
  body('email').isEmail().withMessage('Email must be a valid email'),
  body('password').isLength({min: 8}).withMessage('Password must at least of 8 characters long'),
  userController.createUserController
)

userRoutes.post('/login',
  body('email').isEmail().withMessage('Email must be a valid email'),
  body('password').isLength({min: 8}).withMessage('Password must at least of 8 characters long'),
  userController.loginController
)

userRoutes.get('/profile', authMiddleware.authUser , userController.profileController)

userRoutes.get('/logout', authMiddleware.authUser , userController.logoutController)

userRoutes.get('/all', authMiddleware.authUser , userController.getAllUsersController)

export default userRoutes;