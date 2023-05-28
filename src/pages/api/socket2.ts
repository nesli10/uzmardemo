import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import wordsData from "words.json";

export const config = {
  api: {
    bodyParser: false,
  },
};

const generateWord = () => {
  const randomIndex = Math.floor(Math.random() * wordsData.words.length);
  const randomWord = wordsData.words[randomIndex].toLowerCase();
  return randomWord;
};

export default async (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    const io = new ServerIO(res.socket.server, {
      addTrailingSlash: false,
    });

    const onConnection = (socket: any) => {
      socket.on("joinRoom",({ username, room }: any) => {
          const random = Math.floor(Math.random() * 9000 + 1000);
          username = username + "#" + random;
          const word = generateWord();
            
          socket.join(room);
          console.log(username);
          //console.log(io.sockets.adapter.rooms); //odalar
          //console.log(io.sockets.adapter.rooms.get(room)?.size);
          //console.log(io.sockets.sockets); //bağlı kullanıcılar
          socket.data = {username,score:0};
          if(io.sockets.adapter.rooms.get(room)?.size == 2){
            const opponent:any = 
            Array.from(io.sockets.adapter.rooms.get(room) ?? [])
            .filter((user:any) => user.data.username !== socket.data.username);
            socket.to(socket.id).emit('gameStarted',{word,oponent:opponent.data.username});
            socket.to(opponent.id).emit('gameStarted',{word,opponent:socket.data.username});
            console.log(io.sockets.adapter.rooms.get(room));
          }
          if(io.sockets.adapter.rooms.get(room)?.size ?? 0 < 2){
            console.log(io.sockets.adapter.rooms.get(room));
          }
        });

      socket.on("guessMade", ({ letter, room, username, score }: any) => {
        // 2 oyuncu arasındaki tahmin etkileşimi
        const roomPlayers = Array.from(users.values()).filter(
          (player) => userRooms.get(player.socketId) === room
        );
        if (roomPlayers) {
          const otherPlayer = roomPlayers.find(
            (player) => player.username !== username
          );
          console.log(otherPlayer);
          if (otherPlayer) {
            otherPlayer.score = score;
            otherPlayer.username = username;

            io.to(otherPlayer.socketId).emit("guessMade", {
              letter,
              username,
              score,
            });
          }
        }
      });
    };

    res.socket.server.io = io;
    io.on("connection", onConnection);
  }

  res.end();
};
