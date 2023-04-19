import bcrypt from "bcrypt";
import { HTMLError } from "../../util/errorHandler";
import { RequestHandler } from "express";
import { User } from "../../models/User.model";
import { validationResult } from "express-validator";

export const createUser: RequestHandler = function (req, res, next) {
  const { username, email, password, avatar } = req.body;
  const errors: any = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HTMLError(errors.errors[0].msg, 422);
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPass) => {
      return User.create({
        email,
        hashedPass,
        username,
        avatar,
        conversations: [],
      });
    })
    .then((results) => {
      if (!results) throw new HTMLError("Something went wrong", 500);
      res.status(201).json({ message: "Created user successfully" });
    })
    .catch((error) => {
      next(error);
    });
};
