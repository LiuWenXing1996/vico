import { Schema, type InferSchemaType, model } from "mongoose";

export enum ProjectUrType {
  GitLab,
  GitHub,
}

export const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  urlType: {
    type: Number,
    enum: ProjectUrType,
    required: true,
  },
  description: {
    type: String,
  },
});

export type IProject = InferSchemaType<typeof ProjectSchema>;

export const ProjectModel = model("Project", ProjectSchema);
