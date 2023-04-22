import { Schema, Model } from "../util/database";
import { IConversation } from "../interfaces/Conversation.interface";

const conversationSchema = new Schema<IConversation>(
  {
    initUser: {
      user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
      notifications: Number,
    },
    otherUser: {
      user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
      notifications: Number,
    },
    messages: [
      { type: Schema.Types.ObjectId, ref: "Messages", required: true },
    ],
  },
  { timestamps: true }
);

export const Conversation = Model<IConversation>(
  "Conversations",
  conversationSchema
);
