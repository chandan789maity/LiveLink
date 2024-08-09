import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    message: {
      text: { 
        type: String, 
        required: true 
      },
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
    ],
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model('Message', MessageSchema);
