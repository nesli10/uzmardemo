import React, { useEffect, useState } from "react";
import io from "socket.io-client";
let socket: any;

const Home = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState<any[]>([""]);

  useEffect(() => {
    socketInitilizer();
  }, []);

  function socketInitilizer() {
    fetch("/api/socket")
      .then(() => {
        socket = io();
        console.log("test");
        socket.on("receive-message", (data: any) => {
          console.log(data);
          setAllMessages((pre: any) => [...pre, data]);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    socket.emit("send-message", {
      username,
      message,
    });
  }

  return (
    <div>
      <h1>Chat App</h1>
      <p>Enter Username</p>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <br></br>
      <br />
      {!!username && (
        <div>
          {allMessages.map(({ username, message }: any) => (
            <p>
              {username}: {message}
            </p>
          ))}
          <form onSubmit={handleSubmit}>
            <input
              name="message"
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
