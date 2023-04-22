import { IMessage } from "./Message.interface";
import { IUser } from "./User.interface";

export interface IConversation {
  _id?: string;
  initUser: { user: IUser; notifications: number };
  otherUser: { user: IUser; notifications: number };
  messages: IMessage[];
  createdAt: string;
  save: () => IConversation;
}
