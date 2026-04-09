require('dotenv').config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const connectDB = require("./src/config/dbConfig");
const Chat = require("./src/models/chat.model");
const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("join", (chatId) => socket.join(chatId));

  socket.on("message", async ({ chatId, senderId, text }) => {
    const msg = { sender: senderId, text, createdAt: new Date() };
    await Chat.findByIdAndUpdate(chatId, { $push: { messages: msg } });
    io.to(chatId).emit("message", { ...msg, sender: { _id: senderId } });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
