import { Schema, Model } from "../util/database";
import { IMessage } from "../interfaces/Message.interface";

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    reciever: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const Message = Model<IMessage>("Messages", messageSchema);
