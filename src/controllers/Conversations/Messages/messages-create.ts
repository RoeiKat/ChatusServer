import { RequestHandler } from "express";
import { HTMLError } from "../../../util/errorHandler";
import { validationResult } from "express-validator";
import { User } from "../../../models/User.model";
import { Message } from "../../../models/Message.model";
import { Conversation } from "../../../models/Conversation.model";
import { IConversation } from "../../../interfaces/Conversation.interface";
import { getIO } from "../../../util/connectSocket";
import { IUser } from "../../../interfaces/User.interface";

export const createMessage: RequestHandler = function (req, res, next) {
  let conversation: IConversation;
  let recieverUser: IUser;
  const senderId: string = res.locals.jwt.id;
  const recieverId: string = req.body.to;
  const { message } = req.body;
  const errors: any = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HTMLError(errors.errors[0].msg, 422);
  } else if (senderId.toString() === recieverId.toString()) {
    throw new HTMLError("Matching user id's", 403);
  }
  User.find({ _id: { $in: [senderId, recieverId] } })
    .then((foundUsers) => {
      if (foundUsers.length !== 2)
        throw new HTMLError("Non-existing user id's", 403);
      if (foundUsers[0]._id.toString() === recieverId) {
        recieverUser = foundUsers[0];
      } else {
        recieverUser = foundUsers[1];
      }
      return Conversation.findOne()
        .where("initUser.user")
        .equals([senderId, recieverId])
        .where("otherUser.user")
        .equals([senderId, recieverId]);
    })
    .then((foundConversation) => {
      if (!foundConversation) {
        return Conversation.create({
          initUser: { user: senderId, notifications: 0 },
          otherUser: { user: recieverId, notifications: 0 },
          messages: [],
        })
          .then((newConversation) => {
            conversation = newConversation;
            const io = getIO();
            io.emit("newConversationEvent", {
              initUser: senderId,
              otherUser: recieverId,
            });
            return User.updateMany(
              { _id: { $in: [senderId, recieverId] } },
              { $push: { conversations: newConversation } }
            );
          })
          .then((savedUsers) => {
            return Message.create({
              sender: senderId,
              reciever: recieverId,
              message: message,
            });
          });
      } else {
        conversation = foundConversation;
        return Message.create({
          sender: senderId,
          reciever: recieverId,
          message: message,
        });
      }
    })
    .then((createMessage) => {
      conversation.messages.push(createMessage);
      if (conversation.initUser.user._id?.toString() === senderId) {
        conversation.initUser.notifications += 1;
      } else {
        conversation.otherUser.notifications += 1;
      }
      return conversation.save();
    })
    .then((savedConversation) => {
      return Conversation.findById(savedConversation._id)
        .populate({
          path: "initUser",
          populate: {
            path: "user",
            select: "_id username color",
          },
        })
        .populate({
          path: "otherUser",
          populate: {
            path: "user",
            select: "_id username color",
          },
        })
        .populate({
          path: "messages",
          populate: {
            path: "sender",
            select: "_id username color",
          },
        });
    })
    .then((populatedConversation) => {
      const io = getIO();
      io.emit("newMessageEvent", {
        recieverId: recieverId,
        senderId: senderId,
      });
      res.status(201).json({
        message: "Created message successfully",
        conversation: populatedConversation,
      });
    })
    .catch((error) => {
      next(error);
    });
};
