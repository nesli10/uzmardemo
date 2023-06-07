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

const socket = async (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    const io = new ServerIO(res.socket.server, {
      addTrailingSlash: false,
    });

    const onConnection = (socket: any) => {
      socket.on(
        "joinRoom",
        (
          { username }: any,
          callback: (arg0: boolean, arg1?: string) => void
        ) => {
          const room = socket.id;
          const waitingForSecondPlayer = room;
          const opponentId: any = Array.from(
            socket.adapter.rooms.get(room) ?? []
          ).filter((user: any) => user !== socket.id)[0]; // odadaki kişileri bulur

          if (socket.adapter.rooms.get(room)?.size ?? 0 < 2) {
            socket.join(room);
            socket.emit("getRoom", { room: waitingForSecondPlayer });
          } else {
            callback(false, "Room is full");
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
          callback(true, room);
        }
      );

      socket.on(
        "guessMade",
        ({ room, score, remainingAttempts, word, guesses }: any) => {
          socket.data.score = score;
          //karşı tarafın tahmin için
          const opponentId: any = Array.from(
            socket.adapter.rooms.get(room) ?? []
          ).filter((user: any) => user !== socket.id)[0];
          socket.to(opponentId).emit("opponentGuessMade", {
            opponentScore: score,
          });
          const isGameWon = word
            .split("")
            .every((letter: any) => guesses.includes(letter));
          if (isGameWon) {
            // Kelime tamamen doğru tahmin edildi
            socket.emit("gameOver", { result: "win", score: score, word });

            const opponentScore =
              socket.nsp.sockets.get(opponentId)?.data.score;
            socket
              .to(opponentId)
              .emit("gameOver", { result: "lose", score: opponentScore, word });
          } else if (remainingAttempts === 0) {
            socket.data.remainingAttempts = 0;
            const opponentId = Array.from(
              socket.adapter.rooms.get(room) ?? []
            ).find((user) => user !== socket.id);
            const opponentScore =
              socket.nsp.sockets.get(opponentId)?.data.score;

            if (score > opponentScore) {
              socket.emit("gameOver", { result: "win", score: score, word });
              socket.to(opponentId).emit("gameOver", {
                result: "lose",
                score: opponentScore,
                word,
              });
            } else if (score < opponentScore) {
              socket.emit("gameOver", { result: "lose", score: score, word });
              socket.to(opponentId).emit("gameOver", {
                result: "win",
                score: opponentScore,
                word,
              });
            } else {
              socket.emit("gameOver", { result: "draw", score: score, word });
              socket.to(opponentId).emit("gameOver", {
                result: "draw",
                score: opponentScore,
                word,
              });
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
export default socket;
