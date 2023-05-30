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
      socket.on("joinRoom",({ username, room }: any, callback: (arg0: boolean) => void) => {
          
          if(socket.adapter.rooms.get(room)?.size ?? 0 < 2){
            console.log(socket.id + " joined")
            socket.join(room);
          }
          else{
            callback(false);
          }
          
          //console.log(socket.adapter.rooms); //odalar
          //console.log(socket.adapter.rooms.get(room)?.size);
          //console.log(socket.nsp.sockets); //bağlı kullanıcılar
          const random = Math.floor(Math.random() * 9000 + 1000);
          username = username + "#" + random;
          socket.data = {username,score:0};
           
          if(socket.adapter.rooms.get(room)?.size == 2){
            const word = generateWord();
            const opponentId:any = 
            Array.from(socket.adapter.rooms.get(room) ?? [])
            .filter((user:any) =>  user !== socket.id)[0];
            const opponent= socket.nsp.sockets.get(opponentId);
            //socket.to(socket.id).emit('gameStarted',{word,opponent:opponent.data.username});
            console.log(socket.id);
            console.log(opponent.id);
            socket.to(opponentId).emit('gameStarted',{word,opponent:socket.data.username});
            socket.emit('gameStarted',{word,opponent:opponent.data.username});
          }
          callback(true);
        });

      socket.on("guessMade", ({ room, score }: any) => {
        const opponentId:any = 
            Array.from(socket.adapter.rooms.get(room) ?? [])
            .filter((user:any) =>  user !== socket.id)[0];
        socket.to(opponentId).emit("opponentGuessMade",{opponentScore:score})
      });
    };

    res.socket.server.io = io;
    io.on("connection", onConnection);
  }

  res.end();
};
