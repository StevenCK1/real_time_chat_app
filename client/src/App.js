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

  useEffect(() => {
    const cookieUsername = cookies.get("username");
    const cookieRoom = cookies.get("room");
    if (cookieUsername !== "" && cookieRoom !== "") {
      setUsername(cookieUsername);
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
