import React, { useEffect, useState } from "react";
//import io from "socket.io-client";
import * as Tabs from "@radix-ui/react-tabs";
//let socket: any;

const Home = () => {
  /*
  
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
  }
  */

  return (
    // <div>
    //   <h1>Chat app</h1>
    //   <h1>Enter a username</h1>

    //   <input value={username} onChange={(e) => setUsername(e.target.value)} />

    //   <br />
    //   <br />

    //   <div>
    //     {allMessages.map(({ username, message }, index) => (
    //       <div key={index}>
    //         {username}: {message}
    //       </div>
    //     ))}

    //     <br />

    //     <form onSubmit={handleSubmit}>
    //       <input
    //         name="message"
    //         placeholder="enter your message"
    //         value={message}
    //         onChange={(e) => setMessage(e.target.value)}
    //         autoComplete={"off"}
    //       />
    //     </form>
    //   </div>
    // </div>
    <Tabs.Root className="TabsRoot" defaultValue="tab1">
      <Tabs.List className="TabsList" aria-label="Manage your account">
        <Tabs.Trigger className="TabsTrigger" value="tab1">
          Account
        </Tabs.Trigger>
        <Tabs.Trigger className="TabsTrigger" value="tab2">
          Password
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="TabsContent" value="tab1">
        <p className="Text">
          Make changes to your account here. Click save when you're done.
        </p>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="name">
            Name
          </label>
          <input className="Input" id="name" defaultValue="Pedro Duarte" />
        </fieldset>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="username">
            Username
          </label>
          <input className="Input" id="username" defaultValue="@peduarte" />
        </fieldset>
        <div
          style={{ display: "flex", marginTop: 20, justifyContent: "flex-end" }}
        >
          <button className="Button green">Save changes</button>
        </div>
      </Tabs.Content>
      <Tabs.Content className="TabsContent" value="tab2">
        <p className="Text">
          Change your password here. After saving, you'll be logged out.
        </p>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="currentPassword">
            Current password
          </label>
          <input className="Input" id="currentPassword" type="password" />
        </fieldset>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="newPassword">
            New password
          </label>
          <input className="Input" id="newPassword" type="password" />
        </fieldset>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="confirmPassword">
            Confirm password
          </label>
          <input className="Input" id="confirmPassword" type="password" />
        </fieldset>
        <div
          style={{ display: "flex", marginTop: 20, justifyContent: "flex-end" }}
        >
          <button className="Button green">Change password</button>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default Home;
