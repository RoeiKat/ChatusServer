import { RequestHandler } from "express";
import { Conversation } from "../../models/Conversation.model";
import { Types } from "mongoose";

export const getUserConversations: RequestHandler = function (req, res, next) {
  const tokenId = res.locals.jwt.id;
  Conversation.find({
    $or: [{ initUser: tokenId }, { otherUser: tokenId }],
  }).then((foundConversations) => {
    console.log(foundConversations);
    if (!foundConversations) {
      return res.status(304).json({ message: "No found conversations" });
    } else {
      res.status(200).json({ conversations: foundConversations });
    }
  });
};
