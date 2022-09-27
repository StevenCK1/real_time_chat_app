import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Chat from "./pages/chat";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { getCookie } from "./utils/cookies";

const socket = io.connect("https://real-time-chat-app-fo0h.onrender.com");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    const cookieUsername = getCookie("username");
    const cookieRoom = getCookie("room");

    if (cookieUsername !== "") {
      setUsername(cookieUsername);
    }

    if (cookieRoom !== "") {
      setRoom(cookieRoom);
    }
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
