import { Schema, type InferSchemaType, model } from "mongoose";

export enum ProjectGitWebType {
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
  git: {
    type: {
      url: {
        type: String,
        required: true,
      },
      projectId: {
        type: Number,
        required: true,
      },
      webType: {
        type: Number,
        enum: ProjectGitWebType,
        required: true,
      },
    },
    required: true,
  },
  description: {
    type: String,
  },
});

export type IProject = InferSchemaType<typeof ProjectSchema>;

export const ProjectModel = model("Project", ProjectSchema);
