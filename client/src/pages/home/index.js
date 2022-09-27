import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const Home = ({ username, setUsername, room, setRoom, socket }) => {
  const navigate = useNavigate();

  const joinRoom = () => {
    // On button click, socket event "join_room" will be emitted and this event will be used in server
    if (room !== "" && username !== "") {
      socket.emit("join_room", { username, room });
    }
    // save user data in cookie
    cookies.set("username", username, { path: "/" });
    cookies.set("room", room, { path: "/" });

    // Redirect to /chat
    navigate("/chat", { replace: true });
  };
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>{`ChatRooms`}</h1>
        <input
          className={styles.input}
          placeholder="Username..."
          onChange={(e) => setUsername(e.target.value)}
        />

        <select
          className={styles.input}
          onChange={(e) => setRoom(e.target.value)}
        >
          <option>-- Select Room --</option>
          <option value="sports">Sports</option>
          <option value="technology">Technology</option>
          <option value="sustainability">Sustainability</option>
          <option value="games">Games</option>
        </select>

        <button
          className="btn btn-secondary"
          style={{ width: "100%" }}
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
