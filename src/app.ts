import express from "express";
import morgan from "morgan";
import cors from "cors";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import { connectDB } from "./util/database";
import { connectSocket } from "./util/connectSocket";
import { errorHandler } from "./util/errorHandler";
import { authCheck } from "./middleware/authCheck";
import { corsOptions } from "./config/corsOptions";

import chatRoutes from "./routes/chat.routes";
import userRoutes from "./routes/user.routes";
import { searchUser } from "./controllers/Users/users-read";

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());
app.use(cors(corsOptions));

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "Connected" });
});

app.use("/user", userRoutes);

app.use("/chat", chatRoutes);

app.get("/search", authCheck, searchUser);

app.use(errorHandler);

interface OnlineUsers {
  socketId: string;
  userId: string;
}

let users: OnlineUsers[] = [];

const addUser = (socketId: string, userId: string) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ socketId, userId });
};

const removeUser = (userId: string) => {
  users = users.filter((user) => user.userId !== userId);
};

const clientDisconnect = (socketId: string) => {
  users = users.filter((user) => user.socketId !== socketId);
};

connectDB()
  .then((results) => {
    console.log("Connected to DB Successfully");
    const port = process.env.PORT || 8080;
    const server = app.listen(port, () => {
      console.log(`Running server on ${port}`);
    });
    const socketio = connectSocket(server);
    socketio.on("connection", (socket) => {
      // Tells client to get active users.
      socketio.emit("getUsers", users);
      // Responsible for telling all clients to pull logged in users upon a user joining to the server
      socket.on("addUser", (userId: string) => {
        addUser(socket.id, userId);
        console.log("Someone has joined!");
        socketio.emit("getUsers", users);
      });
      // When a user is logging off, but not leaving the site.
      socket.on("removeUser", (userId: string) => {
        removeUser(userId);
        console.log("Someone logged out...");
        socketio.emit("getUsers", users);
      });
      socket.on("disconnect", () => {
        clientDisconnect(socket.id);
        console.log("Someone left the site.");
        socketio.emit("getUsers", users);
      });
    });
  })
  .catch((error) => {
    console.log(error);
  });
