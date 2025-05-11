import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import ProjectModel from "./models/project.model.js";
import { generateResult } from "./services/ai.service.js";

const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authenticaton Error"));
    }

    const projectId = socket.handshake.query.projectId;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid Project ID"));
    }

    socket.project = await ProjectModel.findById(projectId);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new Error("Token could not be verified"));
    }

    socket.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();

  console.log("A user connected");
  socket.join(socket.roomId);

  socket.on("project-message", async (data) => {

    const message = data.message;
    socket.broadcast.to(socket.roomId).emit("project-message", data);

    if(message.includes('@ai')) {
      const prompt = message.replace('@ai ', '');
      const result = await generateResult(prompt)

      io.to(socket.roomId).emit('project-message', {
        message: result,
        sender: {
          _id: 'ai',
          email: 'AI'
        } 
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected")
    socket.leave(socket.roomId);
  });
});

server.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
