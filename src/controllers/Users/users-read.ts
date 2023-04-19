import bcrypt from "bcrypt";
import { RequestHandler } from "express";

import { HTMLError } from "../../util/errorHandler";
import { validationResult } from "express-validator";
import { signJWT } from "../../functions/signJWT";

import { User } from "../../models/User.model";
import { IUser } from "../../interfaces/User.interface";

export const loginUser: RequestHandler = function (req, res, next) {
  let user: IUser;
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HTMLError("Invalid Input", 422);
  }
  User.findOne()
    .where("email")
    .equals(email)
    .then((foundUser) => {
      if (!foundUser) throw new HTMLError("No user found!", 401);
      user = foundUser;
      return bcrypt.compare(password, user.password);
    })
    .then((comparisonResults) => {
      if (!comparisonResults)
        throw new HTMLError("Invalid email or password", 401);
      const token = signJWT(user);
      res.status(200).json({ token: token, userId: user._id!.toString });
    })
    .catch((error) => {
      next(error);
    });
};

export const checkTakenUserName: RequestHandler = function (req, res, next) {
  const { username } = req.body;
  User.findOne()
    .where("username")
    .equals(username)
    .then((foundUser) => {
      if (foundUser) {
        res.status(302).json({ message: "Username taken" });
      } else {
        res.status(200).json({ message: "Username available" });
      }
    })
    .catch((error) => {
      next(error);
    });
};

export const searchUser: RequestHandler = function (req, res, next) {
  const { query } = req.query;
  const tokenId = res.locals.jwt.id;
  User.find({ username: { $regex: query } })
    .then((foundUsers) => {
      if (!foundUsers) {
        res.status(302).json({ message: "No found users" });
      } else {
        const filteredUsers = foundUsers.filter(
          (user) => user._id.toString() !== tokenId.toString()
        );
        res.status(200).json({ users: filteredUsers });
      }
    })
    .catch((error) => {
      next(error);
    });
};
