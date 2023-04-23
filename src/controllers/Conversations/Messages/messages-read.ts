import { RequestHandler } from "express";
import { HTMLError } from "../../../util/errorHandler";
import { Conversation } from "../../../models/Conversation.model";
import { getIO } from "../../../util/connectSocket";

export const getMessages: RequestHandler = function (req, res, next) {
  const { conversationId } = req.params;
  const tokenId = res.locals.jwt.id;
  Conversation.findById(conversationId)
    .populate({
      path: "initUser",
      populate: {
        path: "user",
        select: "_id",
      },
    })
    .populate({ path: "otherUser", select: "_id" })
    .populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "_id firstName lastName userPhoto",
      },
    })
    .then((foundConversation) => {
      if (!foundConversation)
        throw new HTMLError("No existing conversation", 403);
      const initUserId = foundConversation.initUser.user._id?.toString();
      const otherUserId = foundConversation.otherUser.user._id?.toString();
      if (
        initUserId !== tokenId.toString() &&
        otherUserId !== tokenId.toString()
      )
        throw new HTMLError("Forbidden", 403);
      res.status(200).json({ messages: foundConversation.messages });
      if (foundConversation.initUser.user._id?.toString() === tokenId) {
        foundConversation.otherUser.notifications = 0;
      } else {
        foundConversation.initUser.notifications = 0;
      }
      return foundConversation.save({ timestamps: false });
    })
    .then((savedConversation) => {
      const io = getIO();
      io.emit("newConversationEvent", {
        initUser: savedConversation.initUser.user._id!,
        otherUser: savedConversation.otherUser.user._id!,
      });
    })
    .catch((error) => {
      next(error);
    });
};
