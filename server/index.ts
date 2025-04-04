const express = require("express");
const http = require("http");
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Type Definitions
type Point = { x: number; y: number };
type DrawLine = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
};

type Room = {
  users: { [socketId: string]: string };
  chatHistory: { user: string; message: string }[]; // ✅ Store user and message
  drawHistory: DrawLine[]; // ✅ Store previous drawings
};

const rooms: { [roomId: string]: Room } = {}; // Store room data

io.on("connection", (socket: Socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on(
    "login",
    ({ username, room }: { username: string; room: string }) => {
      if (!rooms[room]) {
        rooms[room] = { users: {}, chatHistory: [], drawHistory: [] }; // ✅ Ensure chatHistory exists
      }

      rooms[room].users[socket.id] = username;
      socket.join(room);

      console.log(`🔄 Sending history to ${socket.id}`);

      // ✅ Send previous drawings and chat messages to the new user
      socket.emit("draw-history", rooms[room].drawHistory);
      socket.emit("chat-history", rooms[room].chatHistory);

      io.to(room).emit("update-users", Object.values(rooms[room].users));
    }
  );
  socket.on("logout", ({ username, room }) => {
    if (!rooms[room]) return;

    // Remove user from room
    Object.keys(rooms[room].users).forEach((id) => {
      if (rooms[room].users[id] === username) {
        delete rooms[room].users[id];
      }
    });

    // Notify remaining users
    io.to(room).emit("update-users", Object.values(rooms[room].users));

    // If the room is empty, delete its history
    if (Object.keys(rooms[room].users).length === 0) {
      delete rooms[room];
    }

    console.log(`🚪 ${username} logged out from room '${room}'`);
  });

  socket.on(
    "draw-line",
    ({ prevPoint, currentPoint, color, room }: DrawLine & { room: string }) => {
      if (!rooms[room]) return;

      // ✅ Save drawing in history
      rooms[room].drawHistory.push({ prevPoint, currentPoint, color });

      // ✅ Send the new drawing to other users
      socket.to(room).emit("draw-line", { prevPoint, currentPoint, color });
    }
  );

  socket.on("send-message", ({ message, room, username }) => {
    if (!rooms[room]) {
      console.log(`❌ Room '${room}' does not exist. Message not sent.`);
      return;
    }

    console.log(`📩 Received: ${username} -> ${message} in ${room}`);

    const chatMessage = { user: username, message };

    // Store message in room's chat history
    rooms[room].chatHistory.push(chatMessage);

    // Limit chat history to the last 20 messages
    if (rooms[room].chatHistory.length > 20) {
      rooms[room].chatHistory.shift();
    }

    // Emit only the new message and log it
    console.log(`🚀 Sending new-message event:`, chatMessage);
    io.to(room).emit("new-message", chatMessage);
  });

  socket.on("clear", (room: string) => {
    if (!rooms[room]) return;

    rooms[room].drawHistory = []; // ✅ Clear stored drawings
    io.to(room).emit("clear");
  });

  socket.on("disconnect", () => {
    for (const room in rooms) {
      if (rooms[room].users[socket.id]) {
        delete rooms[room].users[socket.id];
        io.to(room).emit("update-users", Object.values(rooms[room].users));
      }
    }
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
