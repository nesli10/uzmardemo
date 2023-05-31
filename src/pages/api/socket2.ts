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
      socket.on(
        "joinRoom",
        ({ username, room }: any, callback: (arg0: boolean) => void) => {
          if (socket.adapter.rooms.get(room)?.size ?? 0 < 2) {
            socket.join(room);
          } else {
            callback(false);
            return;
          }

          //console.log(socket.adapter.rooms); //odalar
          //console.log(socket.adapter.rooms.get(room)?.size);
          //console.log(socket.nsp.sockets); //bağlı kullanıcılar
          const random = Math.floor(Math.random() * 9000 + 1000);
          username = username + "#" + random;
          socket.data = { username, score: 0 }; //user dataları

          if (socket.adapter.rooms.get(room)?.size == 2) {
            const word = generateWord();
            const opponentId: any = Array.from(
              socket.adapter.rooms.get(room) ?? []
            ).filter((user: any) => user !== socket.id)[0]; // odadaki kişileri bulur
            const opponent = socket.nsp.sockets.get(opponentId);
            socket
              .to(room)
              .emit("gameStarted", { word, opponent: socket.data.username });
            socket.emit("gameStarted", {
              word,
              opponent: opponent.data.username,
            });
          }
          callback(true);
        }
      );

      socket.on(
        "guessMade",
        ({ room, score, remainingAttempts, word, guesses }: any) => {
          //karşı tarafı tahmin için
          const opponentId: any = Array.from(
            socket.adapter.rooms.get(room) ?? []
          ).filter((user: any) => user !== socket.id)[0];
          socket.to(opponentId).emit("opponentGuessMade", {
            opponentScore: score,
          });

          if (word === guesses) {
            // Mevcut oyuncu kelimeyi doğru tahmin etti ve oyunu kazandı
            socket.emit("gameOver", { result: "win", score: score });
            const opponentId: any = Array.from(
              socket.adapter.rooms.get(room) ?? []
            ).filter((user: any) => user !== socket.id)[0];
            socket
              .to(opponentId)
              .emit("gameOver", { result: "lose", score: score });
          } else {
            // Oyuncu kelimeyi yanlış tahmin etti veya kalan deneme hakkı bitti

            if (remainingAttempts === 0) {
              // Oyun berabere, kalan deneme hakkı bitti ve kimse kelimeyi doğru tahmin edemedi
              const opponentId: any = Array.from(
                socket.adapter.rooms.get(room) ?? []
              ).filter((user: any) => user !== socket.id)[0];
              const opponentScore =
                socket.nsp.sockets.get(opponentId)?.data.score;

              if (score > opponentScore) {
                // Mevcut oyuncunun skoru rakibin skorundan büyükse
                socket.emit("gameOver", { result: "win", score: score });
                socket
                  .to(opponentId)
                  .emit("gameOver", { result: "lose", score: score });
              } else if (score < opponentScore) {
                // Mevcut oyuncunun skoru rakibin skorundan küçükse
                socket.emit("gameOver", { result: "lose", score: score });
                socket
                  .to(opponentId)
                  .emit("gameOver", { result: "win", score: score });
              } else {
                // Skorlar eşitse
                socket.emit("gameOver", { result: "draw", score: score });
                socket
                  .to(opponentId)
                  .emit("gameOver", { result: "draw", score: score });
              }
            }
          }
        }
      );
    };

    res.socket.server.io = io;
    io.on("connection", onConnection);
  }

  res.end();
};
