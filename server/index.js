require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const harperSaveMessage = require("./services/harper-save-message");
const harperGetMessages = require("./services/harper-get-messages");
const leaveRoom = require("./utils/leave-room");

app.use(cors());

const server = http.createServer(app);

// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: [
      "https://real-time-chat-app-sc.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

const CHAT_BOT = "ChatBot";
let chatRoom = ""; // E.g. javascript, node,...
let allUsers = []; // All users in current chat room

// Listen for when the client connects via socket.io-client
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("join_room", (data) => {
    const { username, room } = data; // Data sent from client when join_room event emitted
    socket.join(room); // Join the user to a socket room

    let __createdtime__ = Date.now(); // Current timestamp

    // Send message to all users currently in the room, apart from the user that just joined
    socket.to(room).emit("receive_message", {
      message: `${username} has joined the chat room`,
      username: CHAT_BOT,
      __createdtime__,
    });

    // Send welcome msg to user that just joined chat only
    socket.emit("receive_message", {
      message: `Welcome ${username}`,
      username: CHAT_BOT,
      __createdtime__,
    });

    // Save the new user to the room
    chatRoom = room;
    if (!allUsers.find((item) => item.id === data.id)) {
      // search by id
      allUsers.push({
        id: socket.id,
        username,
        room,
      });
    }

    // allUsers.push({ id: socket.id, username, room });
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);

    socket.on("send_message", (data) => {
      const { message, username, room, __createdtime__ } = data;
      io.in(room).emit("receive_message", data); // Send to all users in room, including sender
      harperSaveMessage(message, username, room, __createdtime__) // Save message in db
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    });

    // Get last 100 messages sent in the chat room
    harperGetMessages(room)
      .then((last100Messages) => {
        // console.log('latest messages', last100Messages);
        socket.emit("last_100_messages", last100Messages);
      })
      .catch((err) => console.log(err));

    socket.on("leave_room", (data) => {
      const { username, room } = data;
      socket.leave(room);
      const __createdtime__ = Date.now();
      // Remove user from memory
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(room).emit("chatroom_users", allUsers);
      socket.to(room).emit("receive_message", {
        username: CHAT_BOT,
        message: `${username} has left the chat`,
        __createdtime__,
      });
      console.log(`${username} has left the chat`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected from the chat");
      const user = allUsers.find((user) => user.id == socket.id);
      if (user?.username) {
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(chatRoom).emit("chatroom_users", allUsers);
        socket.to(chatRoom).emit("receive_message", {
          message: `${user.username} has disconnected from the chat.`,
        });
      }
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello 👋, server is live!");
});

server.listen(PORT, () => "Server is running on port 4000");
