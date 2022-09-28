import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Chat from "./pages/chat";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const socket = io.connect("https://real-time-chat-app-fo0h.onrender.com");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const readCookie = () => {
    const username = cookies.get("username");
    const room = cookies.get("room");
    if (username !== "" && room !== "") {
      setUsername(username);
      setRoom(room);
      socket.emit("join_room", { username, room });
    }
  };

  // think the chat components are not re rendering because it's not receiving a socket event (components in useEffect)
  useEffect(() => {
    readCookie();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            }
          />
          <Route
            path="/chat"
            element={<Chat username={username} room={room} socket={socket} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
