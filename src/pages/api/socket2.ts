import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import wordsData from "words.json";

export const config = {
  api: {
    bodyParser: false,
  },
};

const rooms = new Map<string, any[]>();

const generateWord = () => {
  const randomIndex = Math.floor(Math.random() * wordsData.words.length);
  const randomWord = wordsData.words[randomIndex].toLowerCase();
  return randomWord;
};

export default async (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    const io = new ServerIO(res.socket.server, {
      addTrailingSlash: false,
    });

    const onConnection = (socket: any) => {
      socket.on(
        "joinRoom",
        ({ username, room }: any, callback: (arg0: boolean) => void) => {
          const roomPlayers = socket.rooms.get(room).clients;
          console.log(roomPlayers);

          if (roomPlayers?.length === 2) {
            const word = generateWord();
            io.to(room).emit("gameStarted", {
              word,
              opponent: roomPlayers,
            });
          }

          if (roomPlayers?.length < 2) {
            socket.join(room);
            socket.join(room + "." + username);
            callback(true);
          }
          callback(false);
        }
      );

      socket.on("guessMade", ({ letter, room, username, score }: any) => {
        // 2 oyuncu arasındaki tahmin etkileşimi
        const roomPlayers = rooms.get(room);
        if (roomPlayers) {
          const otherPlayer = roomPlayers.find(
            (player) => player.username !== username
          );
          if (otherPlayer) {
            otherPlayer.score = score;
            otherPlayer.username = username;

            io.to(otherPlayer.socketId).emit("guessMade", {
              letter,
              username,
              score: otherPlayer.score,
            });
          }
        }
      });
      console.log("New Connection", socket.id);
    };

    res.socket.server.io = io;
    io.on("connection", onConnection);
    console.log("Server Started.");
  }

  res.end();
};
