import { IUser } from "./User.interface";

export interface IMessage {
  _id?: string;
  sender: IUser;
  reciever: IUser;
  message: string;
  createdAt: string;
}
