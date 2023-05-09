import { Server } from "socket.io";

let todoList: any = [];

export default function handler(req: any, res: any) {
  const io = new Server().attach(3000);

  io.on("connection", (socket) => {
    console.log("a user connected");

    io.emit("todoList", todoList);

    socket.on("addTodo", (newTodo) => {
      todoList.push(newTodo);
      io.emit("todoList", todoList);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  res.status(200).json({ message: "Socket.IO server started" });
}
