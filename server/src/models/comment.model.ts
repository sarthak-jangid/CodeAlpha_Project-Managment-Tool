import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  message: string;
  task?: mongoose.Types.ObjectId;
  project?: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema<IComment> = new Schema(
  {
    message: { type: String, required: true, trim: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);

const Comment = mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
