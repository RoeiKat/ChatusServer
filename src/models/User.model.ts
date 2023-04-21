import { Schema, Model } from "../util/database";
import { IUser } from "../interfaces/User.interface";

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    color: String,
    conversations: [
      { type: Schema.Types.ObjectId, ref: "Conversations", required: true },
    ],
  },
  { timestamps: true }
);

export const User = Model<IUser>("Users", userSchema);
