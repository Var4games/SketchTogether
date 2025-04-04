# 🎨 Real-time Collaborative Drawing & Chat App

A real-time drawing and chat application using **Next.js** (React) for the frontend and **Node.js + Socket.io** for the backend. Users can log in, join rooms, collaborate on a shared canvas, and chat in real time.

---

## 🚀 Features

✅ **User Authentication** - Simple username-based login
✅ **Create & Join Rooms** - Users can collaborate in separate rooms
✅ **Real-time Drawing** - Canvas updates for all users in the room
✅ **Persistent Chat** - Room-based chat history
✅ **Online Users List** - View users currently in the room
✅ **Canvas Controls** - Change brush color and clear canvas

---

## 🛠 Setup & Installation

### 1️⃣ **Clone the Repository**

```sh
git clone https://github.com/your-repo-name.git
cd your-repo-name
```

### 2️⃣ **Install Dependencies**

#### **Frontend (Next.js)**

```sh
cd client
npm install
```

#### **Backend (Node.js + Socket.io)**

```sh
cd server
npm install
```

### 3️⃣ **Run the Application**

#### **Start Backend Server**

```sh
cd server
npx ts-node index.ts
```

#### **Start Frontend Development Server**

```sh
cd client
npm run dev
```

---

## 📌 Usage

1️⃣ **Open the app in your browser:** `http://localhost:3000`
2️⃣ **Enter a username and room name** to join or create a room
3️⃣ **Start drawing** and chatting in real-time!

---

## 📁 Project Structure

```
📦 project-root
 ┣ 📂 client       # Next.js Frontend
 ┃ ┣ 📂 app        # Main pages
 ┃ ┣ 📂 components   # UI components
 ┃ ┣ 📂 hooks        # Custom hooks (useDraw)
 ┃ ┗ 📂 utils        # Drawing utilities
 ┣ 📂 server        # Node.js Backend
 ┃ ┣ 📜 index.ts     # Main socket server
 ┗ 📜 README.md      # Project documentation
```

---

## 🌟 Technologies Used

- **Frontend:** Next.js (React), TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, Socket.io
- **Libraries:** `react-colorful` (Color Picker), `socket.io-client`

---

## 📌 Future Improvements

- ✅ **User authentication with NextAuth.js**
- ✅ **Database support (MongoDB) for persistent chat & drawings**
- ✅ **Enhanced UI/UX with more tools (Eraser, Shapes, Layers)**

---

## 📧 Contact & Contributions

Feel free to contribute to the project by submitting pull requests or reporting issues.

📩 **Email:** 19vishnuk99@gmail.com  
🔗 **GitHub:** [your-repo-link](https://github.com/your-repo-name)
