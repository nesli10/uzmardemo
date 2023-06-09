import React, { useEffect, useState } from "react";
import io from "socket.io-client";
let socket: any;

const Home = () => {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [allMessages, setAllMessages] = useState<any[]>([]);

  useEffect(() => {
    socketInitializer();

    return () => {
      socket?.disconnect();
    };
  }, []);

  async function socketInitializer() {
    await fetch("/api/socket");

    socket = io();

    socket.on("receive-message", (data: any) => {
      setAllMessages((pre: any) => {
        return [...pre, data];
      });
    });
  }

  function handleSubmit(e: any) {
    e.preventDefault();

    console.log("emitted");

    socket.emit("send-message", {
      username,
      message,
    });
    setMessage("");
    setUsername("");
  }

  return (
    <div style={{ position: "relative", left: "50rem" }}>
      <h1>Chat app</h1>
      <h4>Enter a username</h4>

      <input value={username} onChange={(e) => setUsername(e.target.value)} />

      <br />
      <br />

      <div>
        <form style={{ marginBottom: "20px" }}>
          <input
            name="message"
            placeholder="enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete={"off"}
          />
        </form>
        <button onClick={handleSubmit}>send</button>
        <br />
        <br />
        <div>
          {allMessages.map(({ username, message }, index) => (
            <div key={index}>
              {username}: {message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
