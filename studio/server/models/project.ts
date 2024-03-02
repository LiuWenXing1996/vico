import { Schema, type InferSchemaType, model } from "mongoose";

export const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

export type IProject = InferSchemaType<typeof ProjectSchema>;

export const ProjectModel = model("Project", ProjectSchema);
