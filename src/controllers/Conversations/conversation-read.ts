import { RequestHandler } from "express";
import { Conversation } from "../../models/Conversation.model";

export const getUserConversations: RequestHandler = function (req, res, next) {
  const tokenId = res.locals.jwt.id;
  Conversation.find()
    .where("initUser")
    .equals(tokenId)
    .where("secondUser")
    .equals(tokenId)
    .then((foundConversations) => {
      if (!foundConversations) {
        return res.status(304).json({ message: "No found conversations" });
      } else {
        res.status(200).json({ conversations: foundConversations });
      }
    });
};
