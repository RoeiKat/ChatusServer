import { IConversation } from "./Conversation.interface";

export interface IUser {
  _id?: string;
  email: string;
  username: string;
  password: string;
  color?: string;
  conversations: IConversation[];
  createdAt: string;
}
