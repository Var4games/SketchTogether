"use client";

import { useDraw } from "@/hooks/useDraw";
import { drawLine } from "@/utils/drawLine";
import React, { FC, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { io } from "socket.io-client";
import AuthForm from "../components/AuthForm";
import UserList from "../components/UserList";

const socket = io("https://sketchtogether-production.up.railway.app", {
  transports: ["websocket"],
});
type Point = { x: number; y: number };
type DrawLineProps = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
};

type PageProps = object;

const Page: FC<PageProps> = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [color, setColor] = useState("#000");
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);
  const [users, setUsers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ user: string; message: string }[]>(
    []
  );

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRoom = localStorage.getItem("room");

    if (storedUsername && storedRoom) {
      setUsername(storedUsername);
      setRoom(storedRoom);
      setIsLoggedIn(true);
    }
    if (!isLoggedIn) return;

    socket.emit("login", { username, room });

    socket.on("update-users", (userList) => setUsers(userList));
    socket.on("chat-history", (history) => setMessages(history));
    socket.on(
      "draw-line",
      ({ prevPoint, currentPoint, color }: DrawLineProps) => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;
        drawLine({ prevPoint, currentPoint, ctx, color });
      }
    );

    socket.on("draw-history", (history) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      history.forEach(({ prevPoint, currentPoint, color }: DrawLineProps) => {
        drawLine({ prevPoint, currentPoint, ctx, color });
      });
    });
    socket.on("new-message", (newMsg) =>
      setMessages((prev) => [...prev, newMsg])
    );
    socket.on("clear", clear);

    return () => {
      socket.off("update-users");
      socket.off("chat-history");
      socket.off("draw-line");
      socket.off("new-message");
      socket.off("draw-history");
      socket.off("clear");
    };
  }, [isLoggedIn, canvasRef]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("send-message", { room, message, username });
    setMessage("");
  };

  function createLine({
    prevPoint,
    currentPoint,
    ctx,
  }: {
    prevPoint: Point | null;
    currentPoint: Point;
    ctx: CanvasRenderingContext2D;
  }) {
    socket.emit("draw-line", { room, prevPoint, currentPoint, color });
    drawLine({ prevPoint, currentPoint, ctx, color });
  }

  const joinRoom = () => {
    if (username.trim() && room.trim()) {
      localStorage.setItem("username", username);
      localStorage.setItem("room", room);
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    socket.emit("logout", { username, room });
    localStorage.removeItem("username");
    localStorage.removeItem("room");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <AuthForm
        username={username}
        room={room}
        setUsername={setUsername}
        setRoom={setRoom}
        joinRoom={joinRoom}
      />
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-row bg-gray-100 p-5 gap-4">
      <div className="flex flex-col gap-4 w-1/4">
        <UserList users={users}></UserList>
        <HexColorPicker
          color={color}
          onChange={setColor}
          className="w-32 h-32"
        />
        <button
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg"
          onClick={() => socket.emit("clear", room)}
        >
          Clear Canvas
        </button>
      </div>
      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={550}
        height={550}
        className="border border-gray-400 rounded-lg shadow-md bg-white flex-grow"
      />
      <div className="flex flex-col w-1/3">
        <div className="w-full bg-white p-4 rounded-xl shadow-lg flex flex-col flex-grow">
          <h3 className="text-lg  dark:text-black font-semibold mb-2">
            💬 Chat
          </h3>
          <div className="flex-1 overflow-y-auto border p-2 rounded-md bg-gray-100 dark:bg-gray-800 h-80">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className="p-2 my-1 rounded-lg text-sm bg-white dark:bg-gray-700 text-black dark:text-white"
              >
                <strong>{msg.user}:</strong> {msg.message}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className="flex-1 p-2 border  dark:text-black rounded-lg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Send
            </button>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Page;
