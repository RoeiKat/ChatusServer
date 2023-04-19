import { Router } from "express";
import { body } from "express-validator";
import {
  checkTakenEmail,
  checkTakenUserName,
  loginUser,
} from "../controllers/Users/users-read";
import { createUser } from "../controllers/Users/users-create";

const router = Router();

// User login
router.post("/login", body("email").isEmail().normalizeEmail(), loginUser);

// User registeration
router.post(
  "/register",
  [
    body("email", "Please enter a valid email").isEmail().normalizeEmail(),
    body("password", "Invalid password, 8-16 char long and alphanumeric")
      .isLength({ min: 8, max: 16 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm pass isnt matching");
      } else {
        return true;
      }
    }),
  ],
  createUser
);

// Checks if email is taken
router.get("/check-email", checkTakenEmail);

// Checks if username is taken
router.get("/check-username", checkTakenUserName);

export default Router;
