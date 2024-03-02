import { Schema, type InferSchemaType, model } from "mongoose";

export const BranchSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

export type IBranch = InferSchemaType<typeof BranchSchema>;

export const BranchModel = model("Branch", BranchSchema);
