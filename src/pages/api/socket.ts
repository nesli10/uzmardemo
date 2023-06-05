import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

const socket = async (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    const io = new ServerIO(res.socket.server, {
      addTrailingSlash: false, // important 404 vs
    });
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
    const onConnection = (socket: any) => {
      socket.on("send-message", (obj: any) => {
        console.log("new Message", obj);
        io.emit("receive-message", obj);
      });
      console.log("New Connection", socket.id);
    };
    io.on("connection", onConnection);
    console.log("Server Started.");
  }

  res.end();
};
export default socket;
