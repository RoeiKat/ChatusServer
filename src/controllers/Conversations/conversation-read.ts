import { RequestHandler } from "express";
import { Conversation } from "../../models/Conversation.model";
import { Types } from "mongoose";

export const getUserConversations: RequestHandler = function (req, res, next) {
  const tokenId = res.locals.jwt.id;
  Conversation.find({
    $or: [{ "initUser.user": tokenId }, { "otherUser.user": tokenId }],
  })
    .populate({
      path: "initUser",
      populate: {
        path: "user",
        select: "_id username color ",
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
    })
    .sort([["updatedAt", "descending"]])
    .then((foundConversations) => {
      if (!foundConversations) {
        return res.status(304).json({ message: "No found conversations" });
      } else {
        res.status(200).json({ conversations: foundConversations });
      }
    });
};
