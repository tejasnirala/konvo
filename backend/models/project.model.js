import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: [true, "project name must be unique"],
    lowercase: true,
    trim: true
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  ]
})

const ProjectModel = mongoose.model("project", ProjectSchema);

export default ProjectModel;