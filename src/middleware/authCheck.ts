import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { HTMLError } from "../util/errorHandler";

export const authCheck: RequestHandler = function (req, res, next) {
  let token = req.headers.authorization?.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET!, (error, decodedToken) => {
      if (error) throw new HTMLError("Invalid token", 401);
      else {
        res.locals.jwt = decodedToken;
      }
    });
  } else throw new HTMLError("No token given!", 401);
  next();
};
