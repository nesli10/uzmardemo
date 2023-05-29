import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import wordsData from "words.json";

export const config = {
  api: {
    bodyParser: false,
  },
};
const users = new Map<string, any>();
const userRooms = new Map<string, string>();
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
      socket.on(
        "joinRoom",
        ({ username, room }: any, callback: (arg0: boolean) => void) => {
          const user = {
            username,
            socketId: socket.id,
            score: 0,
          };

          users.set(socket.id, user);
          userRooms.set(socket.id, room); // kullanıcının hangi odada olduğu

          const playersInRoom = Array.from(users.values()).filter(
            (player) => userRooms.get(player.socketId) === room
          );

          if (playersInRoom.length === 2) {
            const word = generateWord();
            const [player1, player2] = playersInRoom;

            io.to(player1.socketId).emit("gameStarted", {
              word,
              opponent: player2.username,
            });

            io.to(player2.socketId).emit("gameStarted", {
              word,
              opponent: player1.username,
            });
          } else if (playersInRoom.length > 2) {
            // Eğer iki oyuncudan fazlası varsa yeni bir oda oluştur
            const newRoom = room + "-" + Date.now(); // Yeni oda adı
            userRooms.set(socket.id, newRoom); // Kullanıcıyı yeni odaya taşı

            socket.join(newRoom);
            socket.join(newRoom + "." + username);
            callback(true);
          } else {
            socket.join(room);
            socket.join(room + "." + username);
            callback(true);
          }
        }
      );
      socket.on("guessMade", ({ letter, room, username }: any) => {
        const currentUser = users.get(socket.id);
        const playersInRoom = Array.from(users.values()).filter(
          // aynı odadaki oyuncuları buluyor
          (player) => userRooms.get(player.socketId) === room
        );

        const opponent = playersInRoom.find(
          (player) => player.username !== username
        );

        if (opponent) {
          io.to(opponent.socketId).emit("opponentGuessMade", {
            letter,
            username: currentUser.username,
            opponentScore: opponent.score,
          });
        }
      });

      console.log("New Connection", socket.id);
    };

    res.socket.server.io = io;
    io.on("connection", onConnection);
  }

  res.end();
};
