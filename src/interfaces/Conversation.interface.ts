import { IMessage } from "./Message.interface";
import { IUser } from "./User.interface";

export interface IConversation {
  _id?: string;
  initUser: IUser;
  otherUser: IUser;
  messages: IMessage[];
  createdAt: string;
  save: () => IConversation;
}
