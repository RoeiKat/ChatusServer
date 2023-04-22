import { RequestHandler } from "express";
import { Conversation } from "../../models/Conversation.model";
import { Types } from "mongoose";

export const getUserConversations: RequestHandler = function (req, res, next) {
  const tokenId = res.locals.jwt.id;
  Conversation.find({
    $or: [{ initUser: tokenId }, { otherUser: tokenId }],
  })
    .populate("initUser", "_id username color")
    .populate("otherUser", "_id username color")
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
