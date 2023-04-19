import { Schema, Model } from "../util/database";
import { IConversation } from "../interfaces/Conversation.interface";

const conversationSchema = new Schema<IConversation>(
  {
    initUser: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    otherUser: { type: Schema.Types.ObjectId, ref: "Users", required: true },
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
