import { useState, useEffect } from "react";
import io from "socket.io-client";

export default function Home() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("todoList", (todoList) => {
      setTodoList(todoList);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const addTodo = () => {
    const socket = io("http://localhost:3000");

    socket.emit("addTodo", newTodo);

    setNewTodo("");
  };

  return (
    <div>
      <h1>Real-time Todo List</h1>
      <ul>
        {todoList.map((todo) => (
          <li key={todo}>{todo}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={addTodo}>Add Todo</button>
    </div>
  );
}
