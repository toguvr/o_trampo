import { Server } from "socket.io";
const connectedUsers = {};

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");

    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      const { user_id } = socket.handshake.query;

      console.log(user_id);
      connectedUsers[user_id] = socket.id;

      socket.broadcast.emit("a user connected");

      socket.on("hello", (msg) => {
        socket.emit("hello", "world");
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("socket.io already running");
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
