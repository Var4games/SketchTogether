import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const AuthForm = ({ username, room, setUsername, setRoom, joinRoom }) => {
  const formRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!formRef.current) return;

    gsap.fromTo(
      formRef.current.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return; // Prevent accessing null

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function drawCircle(x, y, radius, color, delay) {
      const circle = { radius: 0 };
      gsap.to(circle, {
        radius,
        duration: 1,
        delay,
        ease: "elastic.out(1, 0.5)",
        onUpdate: () => {
          if (!canvasRef.current) return; // Prevent accessing null on re-renders

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          circles.forEach(({ x, y, color, circle }) => {
            ctx.beginPath();
            ctx.arc(x, y, circle.radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
          });
        },
      });
      return { x, y, color, circle };
    }

    const circles = [];
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const radius = Math.random() * 50 + 10;
      const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      circles.push(drawCircle(x, y, radius, color, i * 0.1));
    }
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 gap-4">
      {/* Canvas for animations */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      {/* Form */}
      <div ref={formRef} className="z-10 flex flex-col items-center gap-4">
        <input
          type="text"
          placeholder="Enter your name"
          className="p-2  border dark:text-black rounded-lg w-full max-w-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter room name"
          className="p-2 border rounded-lg dark:text-black w-full max-w-sm"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg w-full max-w-sm hover:bg-blue-700"
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
