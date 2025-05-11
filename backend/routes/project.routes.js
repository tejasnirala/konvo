import Router from 'express';
import { body } from 'express-validator';
import * as projectController from "../controllers/project.controller.js"
import * as authMiddleware from "../middlewares/auth.middleware.js"

const projectRoutes = Router();

projectRoutes.post("/create",
  authMiddleware.authUser,
  body('name').isString().withMessage('Name is required'),
  projectController.createProject
)

projectRoutes.get("/all",
  authMiddleware.authUser,
  projectController.getAllProjects
)

projectRoutes.put("/add-user",
  authMiddleware.authUser,
  body('projectId').isString().withMessage('Project ID is required'),
  body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
  projectController.addUserToProject
)

projectRoutes.get("/get-project/:projectId",
  authMiddleware.authUser,
  projectController.getProjectById
)

export default projectRoutes;